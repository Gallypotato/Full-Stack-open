import React,{ useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { likeBlog, removeBlog, commentBlog } from "../redux/blogSlice"; 

const SingleBlog = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {id} = useParams()
  const blogs = useSelector((state) => state.blogs.blogs)
  const blog = blogs.find((blog) => blog.id === id)
  const currentUser = useSelector((state) => state.user.user);
  const [liked, setLiked] = useState(false);   
  const [commentText, setCommentText] = useState("");

  const handleLike = async () => {
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
        await dispatch(removeBlog(blog.id));
        navigate("/");
      } catch (error) {
        console.error("Error removing blog:", error);
      }
    }
  };
  
  const handleComment = async (e) => {
    e.preventDefault(); 
    try {
      dispatch(commentBlog({ id: blog.id, comment: commentText }));
      setCommentText("");  // Clear the input field after submission
    } catch (error) {
      console.error("Error adding comment:", error);
    }
    };

  if (!blog) {
    return <p>Loading blog...</p>;
  }
    return (
      <div>
        <h2>{blog.title}</h2>
        <div className="blogDetail" style={{ marginTop: "10px" }}>
          <p>
            <a href={blog.url} target="_blank" rel="noopener noreferrer">
              {blog.url}
            </a>
          </p>
          <p>
            {blog.likes} likes
            {!liked &&<button onClick={handleLike}>Like</button>}
          </p>
          <p>added by {blog.user.username}</p>
          {currentUser && blog.user?.username === currentUser.username && (
          <button onClick={handleRemove}>Remove</button>
        )}
        </div>
        <div>
          <h3>comments</h3>
          <form onSubmit={handleComment}>
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}  // Handle text input changes
              placeholder="Add a comment..."
              rows="4"
            />
            <button type="submit">Add Comment</button>
          </form>
          {blog.comments && blog.comments.length > 0 ? (
           blog.comments.map((commentObj, index) => (
             <p key={index}>{commentObj.comment}</p> 
           ))
           ) : (
           <p>No comments yet</p>
  )}
        </div>
      </div>
    )
}

export default SingleBlog