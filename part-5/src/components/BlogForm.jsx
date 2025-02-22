import { useState } from 'react'

const BlogForm = ({ handleSubmit }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  return (
    <div>
      <form onSubmit={() => handleSubmit(title, setTitle, author, setAuthor, url, setUrl) }>
        <div>
          Title
          <input
            id='title-input'
            data-testid='title-input'
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        Author
        <input
          id='author-input'
          data-testid='author-input'
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
        <div>
          Url
          <input
            id='url-input'
            data-testid='url-input'
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit" name='create'>create</button>
      </form>
    </div>
  )
}

export default BlogForm