/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import "./index.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch,useSelector } from "react-redux";
import { setNotification, clearNotification } from "./redux/notificationSlice";
import { fetchBlogs, createBlog, setToken } from './redux/blogSlice';
import { login, setUser, clearUser } from "./redux/userSlice";

import Blog from "./components/Blog";
import Notification from "./components/Notification";
import AddBlogForm from "./components/AddBlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.blogs);
  const status = useSelector((state) => state.blogs.status);
  const user = useSelector((state) => state.user.user);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")

  const addBlogFormRef = useRef();

  // fetch blogs for logined user
  useEffect(() => {
    const getBlogs = async () => {
      const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        console.log('user at beginning:', user)
        if (isTokenExpired(user)) {
          handleNotification("Session expired, please log in again.", "error");
          handleLogout();
          return;
        }
        dispatch(setUser(user));
        dispatch(setToken(user.token)); 
        dispatch(fetchBlogs());
      }
    };
    getBlogs();
  }, [dispatch]);

  const handleNotification = (message, type, timeout = 5000) => {
    dispatch(setNotification({ message, type }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, timeout);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await dispatch(login({ username, password })).unwrap();
      dispatch(setToken(user.token));
      dispatch(setUser(user));
      setUsername("");
      //setPassword("");
      dispatch(clearNotification());
      dispatch(fetchBlogs())
      handleNotification("Logged in successfully", "notice");
    } catch (exception) {
      handleNotification("Wrong username or password", "error");
    }
  };

  const handleLogout = useCallback(() => {
    window.localStorage.removeItem("loggedBlogappUser");
    dispatch(clearUser()); 
    dispatch(clearNotification());
  }, [user]);

  const isTokenExpired = (user) => {
    return Date.now() > user.expiryTime;
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username:
        <input
          data-testid="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password:
        <input
          data-testid="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
  const logoutForm = () => {
    if (!user) return null;
    return(
    <div>
      <p>{user?.name} logged-in</p>
      <button onClick={handleLogout}>log out</button>
    </div>
    )
  };

  const addBlog = async (blogObject) => {
    addBlogFormRef.current.toggleVisibility();
    try {
      await dispatch(createBlog(blogObject)).unwrap();
      handleNotification(
        `A new blog "${blogObject.title}" by ${blogObject.author} added`,
        "notice"
      );
    } catch (error) {
      console.error("Error creating blog:", error);
      handleNotification("Error creating blog", "error");
    }
  };

  

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        {loginForm()}
      </div>
    );
  }
  return (
    <div>
      <Notification />
      {logoutForm()}
      <Togglable buttonLabel="new blog" ref={addBlogFormRef}>
        <AddBlogForm createBlog={addBlog} />
      </Togglable>
      <h2>blogs</h2>
      {status === 'loading' ? (
        <div>Loading...</div>
      ) : (
        Array.isArray(blogs) && blogs.length > 0 ? (
        [...blogs] 
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            currentUser={user}
          />
        ))
      ):(<div>No blogs available</div>)
      )}
    </div>
  );
};

export default App;
