// components/Home.js
import React, { useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import Blog from './Blog';
import AddBlogForm from './AddBlogForm';
import Togglable from './Togglable';
import { notify } from "../redux/notificationSlice";
import { createBlog } from '../redux/blogSlice';

const Home = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.blogs);
  const status = useSelector((state) => state.blogs.status);
  const addBlogFormRef = useRef();

  const addBlog = async (blogObject) => {
    addBlogFormRef.current.toggleVisibility();
    try {
      await dispatch(createBlog(blogObject)).unwrap();
      dispatch(notify(
        `A new blog "${blogObject.title}" by ${blogObject.author} added`,
        "notice"
      ))
    } catch (error) {
      console.error("Error creating blog:", error);
      dispatch(notify("Error creating blog", "error"));
    }
  };

  return (
    <div>
      <Togglable buttonLabel="create new" ref={addBlogFormRef}>
        <AddBlogForm createBlog={addBlog} />
      </Togglable>
      <TableContainer>
        <Table>
          <TableBody>
          {status === 'loading' ? (
            <TableRow>
              <TableCell>
              Loading...
              </TableCell>
            </TableRow>
            ) : 
              Array.isArray(blogs) && blogs.length > 0 ? (
                [...blogs] 
                  .sort((a, b) => b.likes - a.likes)
                  .map((blog) => (
            <TableRow key={blog.id}>
              <TableCell align='left'>
                <Blog blog={blog}/>
              </TableCell>
            </TableRow>
                  ))
              ):(
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No blogs available
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Home;