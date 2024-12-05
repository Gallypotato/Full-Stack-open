/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import "./index.css";
import { Container, Tabs, Tab, Box, Button} from '@mui/material'
import {
  Routes,
  Route,
  Link,
  useNavigate,useLocation
} from "react-router-dom"

import { useState, useEffect, useCallback } from "react";
import { useDispatch,useSelector } from "react-redux";
import { clearNotification, notify } from "./redux/notificationSlice";
import { fetchBlogs, setToken } from './redux/blogSlice';
import { setUser, clearUser } from "./redux/userSlice";

import Notification from "./components/Notification";
import UserBlogs from "./components/UserBlog";
import Users from "./components/Users";
import Home from "./components/Home";
import LoginForm from "./components/LoginForm";
import SingleBlog from "./components/SingleBlog";


const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  // fetch blogs for logined user
  useEffect(() => {
    const getBlogs = async () => {
      const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        // const userId = jwtDecode(user.token).id;
        // console.log("User ID:", userId);
        if (isTokenExpired(user)) {
          dispatch(notify("Session expired, please log in again.", "error"));
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


  const handleLogout = useCallback(() => {
    window.localStorage.removeItem("loggedBlogappUser");
    dispatch(clearUser()); 
    dispatch(clearNotification());
  }, [user]);

  const isTokenExpired = (user) => {
    return Date.now() > user.expiryTime;
  };  

  const handleTabChange = (event, newValue) => {
    navigate(newValue); // Navigate to the selected route
  };

  const currentPath = location.pathname;

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm />
      </div>
    );
  }
  return (
    <Container>
    <div>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Tabs
        value={currentPath} // Set the active tab based on the current path
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{ flexGrow: 1 }}
      >
        <Tab label="Blogs" value="/" component={Link} to="/" />
        <Tab label="Users" value="/users" component={Link} to="/users" />
      </Tabs>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
        <em>{user?.name} logged-in</em>
        <Button
          onClick={handleLogout}
          variant="outlined"
          color="secondary"
          size="small"
          sx={{ ml: 2 }}
        >
          Log out
        </Button>
      </Box>
    </Box>
      <h2>blog app</h2>
      <Notification />
      <Routes>
        <Route path="/users" element={<Users /> } />
        <Route path="/users/:id" element={<UserBlogs />} />
        <Route path="/blogs/:id" element={<SingleBlog />} />
        <Route path="/" element={<Home />} />
      </Routes>
      
    </div>
    </Container>
  );
};

export default App;
