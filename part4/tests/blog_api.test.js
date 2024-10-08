const { test, after, beforeEach, describe } = require('node:test')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('assert');
const api = supertest(app)
const helper = require('./test_helper')
// add blogs in test datebase
describe('when there is initially some blogs saved', () =>{
  beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray) //wait for all of the asynchronous operations to finish executing with the Promise.all method
  })

  // 4.8 makes an HTTP GET request to the /api/blogs URL.
  // Verify that the blog list application returns the correct amount of blog posts in the JSON format.
  test('blogs list are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  // 4.9 verifies that the unique identifier property of the blog posts is named id
  // by default the database names the property _id.
  test('identifier property is id', async () => {
    const response = await api
      .get('/api/blogs')
    const firstBlogPost = response.body[0]
    assert.ok(firstBlogPost.id !== undefined); // 确认 'id' 是定义的
    assert.ok(firstBlogPost._id === undefined); // 确认 '_id' 是未定义的
  } )

  describe('addition of a new blog', () => {
    // 4.10   verifies that making an HTTP POST request to the /api/blogs URL successfully creates a new blog post. 
    // At the very least, verify that the total number of blogs in the system is increased by one.
    // verify that the content of the blog post is saved correctly to the database.
    test('a valid blog can be added to db', async () => {
      const newBlog = {
        title: "4.10 verify http post",
        author: "Chan",
        url: "https://reactpatterns.com/",
        likes: 8,
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
      
      const title = blogsAtEnd.map(r => r.title)
      assert(title.includes('4.10 verify http post'))
        })
  
    // 4.11 Write a test that verifies that if the likes property is missing from the request
    //  it will default to the value 0. 
    test('default empty like property to value 0', async () => {
      const newBlog = {
          title: "4.11 verify like property",
          author: "Chan",
          url: "https://reactpatterns.com/",
        }
      
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const likes = blogsAtEnd[blogsAtEnd.length-1].likes
  assert.strictEqual(likes, 0)
    })
  
    //4.12 400 bad request if no title or url while posting new blogs
    describe('title and url test', () => {
      // no title
      test(' 400 request for no title in http post', async () => {
        const newBlog = {
          author: "Chan",
          url: "https://reactpatterns.com/",
          }
        
        const response = 
          await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
          .expect('Content-Type', /application\/json/)  
        
          assert.strictEqual(response.body.error, 'Blog validation failed: title: Path `title` is required.');
      });
      test(' 400 request for no url in http post', async () => {
        const newBlog = {
          title: "4.11 verify like property",
          author: "Chan",
          }
        
        const response = 
          await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
          .expect('Content-Type', /application\/json/)  
        
          assert.strictEqual(response.body.error, 'Blog validation failed: url: Path `url` is required.');
  })
    })
  })

  describe('deletion of a blog', () => {
    test('deleting a single blog post resource', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
      
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
      
      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length-1)

      const titles = blogsAtEnd.map(r => r.title)
      assert(!titles.includes(blogToDelete.title))
    })
  })

  describe('update a blog', () => {
    test('update a single blog post', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      

      const updatedBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author, // Keeping the original author
        url: blogToUpdate.url,       // Keeping the original URL
        likes: blogToUpdate.likes + 1 // Incrementing the number of likes
      };

      

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()

      const updatedBlogFromDb = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
      assert.strictEqual(updatedBlog.likes, updatedBlogFromDb.likes)
    })
  })

  
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Chan',
      name: 'Chan',
      password: 'Chan',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('400 request for no username in http post', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('Username must be at least 3 characters long'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    });

  test('400 request for username length too short in http post', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'r',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('Username must be at least 3 characters long'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    });

  test('400 request for no password in http post', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'root',
      name: 'Superuser',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('Password must be at least 3 characters long'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    });

  test('400 request for password length too short in http post', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 's',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('Password must be at least 3 characters long'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    });
})




after(async () => {
    await mongoose.connection.close()
  })