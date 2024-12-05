/* eslint-disable no-console */
import React,{useEffect}from "react";
import { useSelector, useDispatch} from "react-redux";
import { useParams } from "react-router-dom";
import { fetchBlogs} from "../redux/blogSlice";
import { fetchUsers } from "../redux/allUserSlice";

const UserBlogs = () => {
    const dispatch = useDispatch()
    const {id} = useParams();      
    const blogs = useSelector((state) => state.blogs.blogs);
    const users = useSelector((state) => state.users.users);

    useEffect(() => {
      if (users.length === 0) {
        dispatch(fetchUsers()); // Fetch users data if not already available
      }
      if (blogs.length === 0) {
        dispatch(fetchBlogs()); // Fetch blogs data if not already available
      }
    }, [dispatch, blogs.length, users.length]);

    const user = users.find((u) => u.id === id);
    const userBlogs = blogs.filter((blog) => blog.user.id === id) 
    if (users.length === 0 || blogs.length === 0) {
      return <p>Loading...</p>;
    }

    if (!user) {
      return <p>User not found.</p>; // Handle case where user is not found
    } 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
    return (
      <div>
        <h2>{user.name}</h2>
        <h3>added blogs</h3>
        {userBlogs.length >0 ? (
          <ul>
            {userBlogs.map((blog)=>(
              <li key={blog.id}>
                {blog.title}
              </li>
            ))}
          </ul>
        ):(
          <p>No blogs available for {user.name}.</p>
        )}
      </div>
    )
  }

  export default UserBlogs;