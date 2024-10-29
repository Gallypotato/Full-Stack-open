import { useState } from 'react'

const AddBlogForm = ({ createBlog }) => {

  const [message, setMessage] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()


    createBlog({
      title: newBlog,
      author: newBlogAuthor,
      url: newBlogUrl,
    })

    setNewBlog('')
    setNewBlogAuthor('')
    setNewBlogUrl('')

  }


  return (
    <div>
      <h2>Create new blog</h2>

      <form onSubmit={addBlog}>
        <div>
         Title
          <input
            data-testid='title'
            value={newBlog}
            onChange={(event) => setNewBlog(event.target.value)}
          />
        </div>
        <div>
         Author
          <input
            data-testid='author'
            value={newBlogAuthor}
            onChange={(event) => setNewBlogAuthor(event.target.value)}
          />
        </div>
        <div>
         URL
          <input
            data-testid='url'
            value={newBlogUrl}
            onChange={(event) => setNewBlogUrl(event.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AddBlogForm

