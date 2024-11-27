/* eslint-disable no-console */
const { test, describe, expect, beforeEach } = require("@playwright/test");
const { loginWith, createBlog, viewBlog, likeBlog } = require("./helper");

test.setTimeout(10000);

describe("Blogs app", () => {
  beforeEach(async ({ request, page }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        username: "hanni",
        password: "1006",
      },
    });
    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("Log in to application")).toBeVisible();
    await expect(page.getByTestId("username")).toBeVisible();
    await expect(page.getByTestId("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  describe("Login", () => {
    test("fails with wrong credentials", async ({ page }) => {
      await page.getByTestId("username").fill("hanni");
      await page.getByTestId("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Wrong username or password")).toBeVisible();
    });

    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "hanni", "1006");
      await expect(page.getByText("logged-in")).toBeVisible({ timeout: 5000 });
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.pause();
      await loginWith(page, "hanni", "1006");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(
        page,
        "vegtarian",
        "han kang",
        "https://www.goodreads.com/book/show/25489025-the-vegetarian",
      );
      await expect(page.getByText("vegtarian han kang")).toBeVisible();
    });

    test("the blog can be liked", async ({ page }) => {
      await createBlog(
        page,
        "vegtarian",
        "han kang",
        "https://www.goodreads.com/book/show/25489025-the-vegetarian",
      );
      await createBlog(
        page,
        "The Algorithm Design Manual",
        "Steven S. Skiena",
        "https://www.goodreads.com/book/show/425208.The_Algorithm_Design_Manual?from_search=true&from_srp=true&qid=LP0WKvrvy5&rank=9",
      );

      await viewBlog(page, "vegtarian han kang");
      await likeBlog(page);
    });

    test("the user who added the blog can delete the blog", async ({
      page,
    }) => {
      await createBlog(
        page,
        "vegtarian",
        "han kang",
        "https://www.goodreads.com/book/show/25489025-the-vegetarian",
      );

      await viewBlog(page, "vegtarian han kang");
      const blogText = await page.getByText("vegtarian han kang");
      page.on("dialog", async (dialog) => {
        expect(dialog.type()).toContain("confirm");
        console.log(dialog.message());
        await dialog.accept();
      });
      await page.getByRole("button", { name: "Remove" }).click();
      await expect(blogText).not.toBeVisible();
    });

    test("only the user who added the blog sees the  blog delete button", async ({
      request,
      page,
    }) => {
      await request.post("/api/users", {
        data: {
          username: "minji",
          password: "0507",
        },
      });
      await createBlog(
        page,
        "vegtarian",
        "han kang",
        "https://www.goodreads.com/book/show/25489025-the-vegetarian",
      );
      await page.getByRole("button", { name: "log out" }).click();
      await loginWith(page, "minji", "0507");

      await viewBlog(page, "vegtarian han kang");
      const removeButton = page.getByRole("button", { name: "Remove" });
      await expect(removeButton).not.toBeVisible();
    });

    test("the blogs are arranged in the order according to the likes, the blog with the most likes first.", async ({
      page,
    }) => {
      await page.pause();
      await createBlog(
        page,
        "The Algorithm Design Manual",
        "Steven S. Skiena",
        "https://www.goodreads.com/book/show/425208.The_Algorithm_Design_Manual?from_search=true&from_srp=true&qid=LP0WKvrvy5&rank=9",
      );
      await createBlog(
        page,
        "vegtarian",
        "han kang",
        "https://www.goodreads.com/book/show/25489025-the-vegetarian",
      );

      await viewBlog(page, "vegtarian han kang");
      await likeBlog(page);

      const blogs = await page.locator(".blog").first().innerText();
      expect(blogs).toContain("vegtarian han kang");
    });
  });
});
