import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogService from '../services/blogs';

// Async Thunks for each action
export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async () => {
  const blogs = await blogService.getAll();
  return blogs;
});

export const createBlog = createAsyncThunk('blogs/createBlog', async (newBlog) => {
  const createdBlog = await blogService.create(newBlog);
  return createdBlog;
});

export const likeBlog = createAsyncThunk('blogs/likeBlog', async ({ id, updatedBlog }) => {
  const blog = await blogService.like(id, updatedBlog);
  return blog;
});

export const removeBlog = createAsyncThunk('blogs/removeBlog', async (id) => {
  await blogService.remove(id);
  return id;  // Return the id of the blog to remove it from the Redux state
});

export const commentBlog = createAsyncThunk('comments/createComment', async ({ id, comment }) => {
  const createdComment = await blogService.comment(id, comment);
  return {id, comment: createdComment};
});

export const setToken = createAsyncThunk('blogs/setToken', (token) => {
  blogService.setToken(token);  // Setting the token in the blogService
  return token;  // Return token to update state if necessary
});

const blogSlice = createSlice({
    name: "blogs",
    initialState: {
      blogs: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
      // fetchBlogs
      .addCase(fetchBlogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // createBlog
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
      })

      // likeBlog
      .addCase(likeBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex((blog) => blog.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = { 
            ...state.blogs[index], 
            ...action.payload, 
            user: state.blogs[index].user, };
        }
      })

      // removeBlog
      .addCase(removeBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
      })

      .addCase(commentBlog.fulfilled, (state, action) => {
        const { id, comment } = action.payload;
        const blogIndex = state.blogs.findIndex((blog) => blog.id === id);
        if (blogIndex !== -1) {
          // Add the new comment to the blog's comments array
          state.blogs[blogIndex].comments.push(comment);
        }
      })
  }
});
 
export default blogSlice.reducer;