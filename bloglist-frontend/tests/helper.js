const { expect } = require("@playwright/test");
const loginWith = async (page, username, password) => {
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: "new blog" }).click();
  await page.getByTestId("title").fill(title);
  await page.getByTestId("author").fill(author);
  await page.getByTestId("url").fill(url);
  await page.getByRole("button", { name: "create" }).click();
  await page.getByText(`${title} ${author}`).waitFor();
};

const viewBlog = async (page, textElement) => {
  const BlogText = await page.getByText(textElement);
  const BlogElement = await BlogText.locator("..");
  await BlogElement.getByRole("button", { name: "view" }).click();
};

const likeBlog = async (page) => {
  const likeRow = await page.getByText(/Likes: \d+/);
  const likeButton = await likeRow.locator("..");
  await likeButton.getByRole("button", { name: "Like" }).click();
  const initialLikesText = await likeRow.innerText();
  const initialLikes = parseInt(initialLikesText.split(": ")[1]);
  await expect(likeRow).toHaveText(`Likes: ${initialLikes + 1}`);
};

export { loginWith, createBlog, viewBlog, likeBlog };
