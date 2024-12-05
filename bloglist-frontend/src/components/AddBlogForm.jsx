import { useState } from "react";
import { TextField, Button } from "@mui/material";

const AddBlogForm = ({ createBlog }) => {

  const [newBlog, setNewBlog] = useState("");
  const [newBlogAuthor, setNewBlogAuthor] = useState("");
  const [newBlogUrl, setNewBlogUrl] = useState("");

  const addBlog = async (event) => {
    event.preventDefault();

    createBlog({
      title: newBlog,
      author: newBlogAuthor,
      url: newBlogUrl,
    });

    setNewBlog("");
    setNewBlogAuthor("");
    setNewBlogUrl("");
  };

  return (
    <div>
      <h2>Create new blog</h2>

      <form onSubmit={addBlog}>
        <div style={{ marginBottom: "5px" }}>
          <TextField
            label="title"
            type="text"
            value={newBlog}
            size="small"
            onChange={(event) => setNewBlog(event.target.value)}
          />
        </div>
        <div style={{ marginBottom: "5px" }}>
          <TextField
            label="author"
            type="text"
            value={newBlogAuthor}
            size="small"
            onChange={(event) => setNewBlogAuthor(event.target.value)}
          />
        </div>
        <div style={{ marginBottom: "5px" }}>
          <TextField
            label="url"
            type="text"
            value={newBlogUrl}
            size="small"
            onChange={(event) => setNewBlogUrl(event.target.value)}
          />
        </div>
        <div style={{ marginTop:"16px" ,marginBottom: "16px" }}>
        <Button variant="contained" color="primary" type="submit" size="small">create</Button>
        </div>
      </form>
    </div>
  );
};

export default AddBlogForm;
