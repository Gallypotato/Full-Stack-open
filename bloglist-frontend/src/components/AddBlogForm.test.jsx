import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddBlogForm from './AddBlogForm'
import { expect, vi, test } from 'vitest'

test('calls createBlog with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()
  // Render the AddBlogForm component, passing the mocked createBlog handler as a prop
  render(<AddBlogForm createBlog={createBlog} />)

  // Fill in the form fields
  const inputs = screen.getAllByRole('textbox')
  const [titleInput, authorInput, urlInput] = inputs

  await userEvent.type(titleInput, 'Testing React Forms')
  await userEvent.type(authorInput, 'Jane Doe')
  await userEvent.type(urlInput, 'http://example.com')

  //submit
  const sendButton = screen.getByText('create')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  console.log('createBlog.mock.calls',createBlog.mock.calls)
  expect(createBlog.mock.calls[0][0]).toEqual(
    {
      title: 'Testing React Forms',
      author: 'Jane Doe',
      url: 'http://example.com'
    }
  )

})