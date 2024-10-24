/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useCallback } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import './index.css'
import AddBlogForm from './components/AddBlogForm'
import Togglable from './components/Togglable'


const App = () => {
  const [blogVisible, setBlogVisible] = useState(false)
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
    const fetchBlogs = async () => {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        if (isTokenExpired(user)) {
          setMessage('0 Session expired, please log in again.')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          handleLogout()
          return
        }
        blogService.setToken(user.token)
        try{
          const initialBlogs = await blogService.getAll()
          setBlogs(initialBlogs)
        }catch (error) {
          console.error('Error fetching blogs:', error)
        }
      }
    }

    fetchBlogs()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // set token
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      if(isTokenExpired(user)){
        setMessage(' Session expired, please log in again.') //red //green
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        handleLogout()
        return
      }
      setUser(user)
      blogService.setToken(user.token)}
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      const expiryTime = Date.now() + user.expiresIn * 1000
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify({ ...user, expiryTime })
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage(null)
    } catch (exception) {
      setMessage('Wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = useCallback(() => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setBlogs([])
    console.log('Logout, user:', user)
  },[user])

  const isTokenExpired = (user) => {
    return Date.now() > user.expiryTime
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

  const addBlog = async (blogObject) => {
    addBlogFormRef.current.toggleVisibility()
    try {
      const addedBlog = await blogService.create(blogObject)
      console.log(addedBlog)
      setBlogs(prevBlogs => [...prevBlogs, addedBlog])
      setMessage(`a new blog "${addedBlog.title}" by ${addedBlog.author} added`)
      setTimeout(() => setMessage(null), 5000)
    } catch (error) {
      console.error('Error creating blog:', error)
    }
  }

  const addBlogFormRef = useRef()

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
      <Togglable buttonLabel= 'new blog' ref={addBlogFormRef}>
        <AddBlogForm createBlog={addBlog}/>
      </Togglable>
      <h2>blogs</h2>
      {blogs
        .sort((a,b) => (b.likes - a.likes))
        .map(blog =>
          <Blog key={blog.id} blog={blog} currentUser={user} setBlogs={setBlogs}/>
        )}
    </div>
  )
}

export default App