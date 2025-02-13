import { useState } from 'react'

const BlogForm = ({handleSubmit}) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

  return (
    <div>
        <form onSubmit={handleSubmit}> 
        <div>
          Title 
          <input 
            type="text" 
            value={title}
            name="Title"
            onChange={({target}) => setTitle(target.value)}
          />
        </div>
          Author
            <input 
              type="text" 
              value={author}
              name="Author"
              onChange={({target}) => setAuthor(target.value)}
            />
        <div>
          Url
            <input 
              type="text" 
              value={url}
              name="Url"
              onChange={({target}) => setUrl(target.value)}
            />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm