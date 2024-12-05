/* eslint-disable no-console */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
const Blog = ({ blog }) => {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false);
/*
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 10,
  };
*/
  const toggleVisibility = () => {
    setVisible(!visible); 
  };


  return (
    <div >
      <div
        className="blogInfo"
        style={{ display: "flex", alignItems: "center" }}
      >
        <Link to={`/blogs/${blog.id}`}>
          <div className="blog">
            {blog.title} {blog.author}{" "}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Blog;