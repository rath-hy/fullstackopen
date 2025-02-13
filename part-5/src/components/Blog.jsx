import { useState } from 'react'
import blogService from '../services/blogs'



const Blog = ({ blog, updateBlogLikes, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLikes = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }

    updateBlogLikes(blog.id, updatedBlog)
  }

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${blog.title}" by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} 
      <button onClick={() => {setShowDetails(!showDetails)}}>{showDetails ? 'hide' : 'view'}</button> 
      <div style={{display: showDetails ? '' : 'none'}}>
        <div>{blog.url}</div>
        <div>{blog.likes} <button onClick={handleLikes}>like</button></div>
        <div>{blog.author}</div>
        <button onClick={handleDelete}>remove</button>
      </div>
    
    </div>  
  )
}

export default Blog