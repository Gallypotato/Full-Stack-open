import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/notification'
import './index.css'

const App = () => {
  const [message, setMessage] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  
  // fetch blogs for logined user
  useEffect(() => {
    if (user) {
    const fetchBlogs = async () => {
      try {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            blogService.setToken(user.token)  
            const initialBlogs = await blogService.getAll()  
            setBlogs(initialBlogs)
        }
      } catch (error) {
        console.error('Error fetching blogs:', error)
      }
    }
    fetchBlogs()
  }
  }, [user])
  
  // set token
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      console.log('Logged in user frontend handle login:', user); 
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
    }
 
  const handleLogout = async(event) =>{
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setBlogs([])
    console.log('Logout successful, user:', user);

  }
  const loginForm = () => (
    <form onSubmit={handleLogin}>
        <div>
          username: 
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password: 
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
  )
  const logoutForm = () => (
    <div>
      <p>{user.name} logged-in</p>
      <button onClick={handleLogout}>log out</button>
    </div>  
  )

  const addBlog = async (event) => {
    event.preventDefault()
    
    const blogObject = {
      title: newBlog,
      author: newBlogAuthor,
      url: newBlogUrl,
    }
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)  
      
      try {
        const returnedBlog = await blogService.create(blogObject); 
        setBlogs(blogs.concat(returnedBlog)); 
        setNewBlog(''); 
        setNewBlogAuthor(''); 
        setNewBlogUrl(''); 
        setMessage(`a new blog ${newBlog} by ${newBlogAuthor} added` )
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      } catch (error) {
        console.error('Error creating blog:', error);
      }
    }
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <input
        type="text"
        value={newBlog}
        placeholder="Title"
        onChange={({ target }) => setNewBlog(target.value)} // 更新标题状态
      />
      <input
        type="text"
        value={newBlogAuthor}
        placeholder="Author"
        onChange={({ target }) => setNewBlogAuthor(target.value)} // 更新作者状态
      />
      <input
        type="text"
        value={newBlogUrl}
        placeholder="URL"
        onChange={({ target }) => setNewBlogUrl(target.value)} // 更新URL状态
      />
      <button type="submit">create</button>
    </form>  
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} type="error"/>
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <Notification message={message} type="notice"/>
       {logoutForm()}
       <h2>Create new blog</h2>
       {blogForm()}
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App