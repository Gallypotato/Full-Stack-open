/* eslint-disable no-console */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { likeBlog, removeBlog } from "../redux/blogSlice"; 

const Blog = ({ blog, currentUser }) => {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false);
  const [liked, setLiked] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 10,
  };

  const toggleVisibility = () => {
    setVisible(!visible); 
  };

  const handleLike = async (id) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    try {
      dispatch(likeBlog({ id: blog.id, updatedBlog }));
      setLiked(true);
    } catch (error) {
      console.error("Error liking the blog:", error);
    }
  };

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        dispatch(removeBlog(blog.id));
      } catch (error) {
        console.error("Error removing blog:", error);
      }
    }
  };

  return (
    <div style={blogStyle}>
      <div
        className="blogInfo"
        style={{ display: "flex", alignItems: "center" }}
      >
        <div className="blog">
          {blog.title} {blog.author}{" "}
        </div>
        <button onClick={toggleVisibility} style={{ marginLeft: "10px" }}>
          {visible ? "hide" : "view"}
        </button>
      </div>
      {visible && (
        <div className="blogDetail" style={{ marginTop: "10px" }}>
          <p>{blog.url}</p>
          <div style={{ display: "flex", alignItems: "center" }}>
            <p style={{ marginRight: 8 }}>Likes: {blog.likes}</p>
            {/*!liked && */ <button onClick={handleLike}>Like</button>}
          </div>
          <p>{blog.user?.username || "Unknown User"}</p>
          {currentUser && blog.user?.username === currentUser.username && (
            <button onClick={handleRemove}>Remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
