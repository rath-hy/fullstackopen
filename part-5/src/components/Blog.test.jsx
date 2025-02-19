import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

describe('<Blog />', () => {
  let blog
  let container
  const mockHandler = vi.fn()

  beforeEach(() => {
    blog = {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      url: 'tokillamockingbird.net',
      likes: 8
    }

    container = render(<Blog blog={blog} updateBlogLikes={mockHandler} />).container
  })

  test('by default, renders title and author but not URL or like count', () => {
    expect(screen.getByText(blog.title, { exact: false })).toBeVisible()
    expect(screen.getByText(blog.author, { exact: false })).toBeVisible()
    expect(screen.getByText(blog.url, { exact: false })).not.toBeVisible()
    expect(screen.getByText(blog.likes, { exact: false })).not.toBeVisible()
  })

  test('URL and like count shows when view button is clicked', async () => {
    expect(screen.getByText(blog.url, { exact: false })).not.toBeVisible()
    expect(screen.getByText(blog.likes, { exact: false })).not.toBeVisible()

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    expect(screen.getByText(blog.url, { exact: false })).toBeVisible()
    expect(screen.getByText(blog.likes, { exact: false })).toBeVisible()
  })

  test('if like button is clicked twice, corresponding event handler is called twice', async () => {
    const user = userEvent.setup()
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  test('right parameters', async () => {
    const mockSubmitHandler = vi.fn()
    const blogFormContainer = render(<BlogForm handleSubmit={mockSubmitHandler}/>).container

    const titleInput = blogFormContainer.querySelector('#title-input')
    const authorInput = blogFormContainer.querySelector('#author-input')
    const urlInput = blogFormContainer.querySelector('#url-input')

    const createButton = screen.getByText('create')

    const user = userEvent.setup()

    const newBlog = {
      title: 'Leonardo da Vinci',
      author: 'Walter Isaacson',
      url: 'leonardodavinci.net'
    }

    await user.type(titleInput, newBlog.title)
    await user.type(authorInput, newBlog.author)
    await user.type(urlInput, newBlog.url)

    await user.click(createButton)

    expect(mockSubmitHandler.mock.calls).toHaveLength(1)
    console.log('****', mockSubmitHandler.mock.calls)

    expect(mockSubmitHandler.mock.calls[0][0]).toBe(newBlog.title)
    expect(mockSubmitHandler.mock.calls[0][2]).toBe(newBlog.author)
    expect(mockSubmitHandler.mock.calls[0][4]).toBe(newBlog.url)
  })
})




