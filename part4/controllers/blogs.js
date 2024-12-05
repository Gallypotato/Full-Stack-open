const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

const { userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    user: user._id,
    url: body.url,
    likes: body.likes,
  });

  const savedBlog = await blog.save();
  await savedBlog.populate("user", { username: 1, name: 1 }); // 确保 user 字段包含 username
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (req, res, next) => {
  const user = req.user;

  // get blog by id
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ error: "blog not found" });
  }
  // check if the user match
  if (blog.user.toString() !== user._id.toString()) {
    return res
      .status(401)
      .json({ error: "only the creator can delete this blog" });
  }

  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

// only update likes which everyone can like one blog
blogsRouter.put("/:id", async (req, res, next) => {
  const body = req.body;
  //const user = req.user

  const oldBlog = await Blog.findById(req.params.id);
  /*
  if(oldBlog.user.toString() !== user._id.toString()) {
    return res.status(401).json({ error: 'only the creator can delete this blog' })
  } 
  */
  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, newBlog, {
    new: true,
  });
  res.status(200).json(updatedBlog);
});

blogsRouter.post("/:id/comments", async(req, res) => {
  const blogId = req.params.id;
  const { comment } = req.body;

  
  if (!comment || comment.trim() === "") {
    return res.status(400).json({ error: 'Comment cannot be empty' });
  }

  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    blog.comments.push({ comment, date: new Date() });

    await blog.save();

    res.status(201).json(blog.comments[blog.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ error: 'Error adding comment' });
  }
})
module.exports = blogsRouter;
