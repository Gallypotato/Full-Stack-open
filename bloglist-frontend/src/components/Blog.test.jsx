import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import blogService from '../services/blogs'
import { expect, vi, test } from 'vitest'

// show name and author
test('renders content', () => {
  const blog = {
    title: 'Testing React components',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5,
    user: {
      username: 'johndoe'
    }
  }

  render(<Blog blog={blog} currentUser={null} setBlogs={() => {}} />)

  const element = screen.getByText('Testing React components John Doe')
  expect(element).toBeDefined()

  // Ensure that the URL and number of likes are not rendered by default
  const urlElement = screen.queryByText('https://example.com')
  const likesElement = screen.queryByText('Likes: 5')

  expect(urlElement).toBeNull() // URL should not be visible
  expect(likesElement).toBeNull() // Likes should not be visible
})

// click togglable button to show url and likes
test('renders content and displays URL and likes after clicking view', async () => {
  const blog = {
    title: 'Testing React components',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5,
    user: {
      username: 'johndoe'
    }
  }

  render(<Blog blog={blog} currentUser={null} setBlogs={() => {}} />)

  expect(screen.getByText('Testing React components John Doe')).toBeDefined()

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText('https://example.com')).toBeDefined()
  expect(screen.getByText('Likes: 5')).toBeDefined()
})

test('calls event handler twice if like button is clicked twice', async () => {
  const blog = {
    id:'123',
    title: 'Testing React components',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5,
    user: {
      username: 'johndoe'
    }
  }

  const setBlogs = vi.fn()
  blogService.like = vi.fn().mockResolvedValue({ likes: 6 })

  render(<Blog blog={blog} currentUser={null} setBlogs={setBlogs}  />)
  // view button first
  const viewButton = screen.getByText('view')
  await userEvent.click(viewButton)
  // then like button
  const likeButton = screen.getByText('Like')
  await userEvent.click(likeButton)
  await userEvent.click(likeButton)

  expect(blogService.like).toHaveBeenCalledTimes(2)
})