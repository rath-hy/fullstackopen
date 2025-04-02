// import NewComment from '../components/NewComment'
import blogService from '../services/blogs'
import { useState } from 'react'

const NewComment = ({ blog, handleSubmit }) => {
  const [comment, setComment] = useState('')

  return (
    <div>
      <form onSubmit={(event) => handleSubmit(event, comment, setComment)}>
        <input onChange={() => setComment(event.target.value)} value={comment}></input>
        <button type="submit">add comment</button>
      </form>
    </div>
  )
}


const BlogView = ({blog, handleVote}) => {
  const { title, url, likes, author } = blog
  const [comments, setComments] = useState(blog.comments || [])
  const handleSubmit = async (event, comment, setComment) => {
    event.preventDefault()
    setComments([...comments, comment])
    await blogService.comment(blog.id, comment)
    setComment('')
  }


  return (
    <div>
      <h2>{title}</h2>
      <a href={url}>{url}</a>
      <div>{likes} likes
        <button
          style={{ marginLeft: 3 }}
          onClick={() => handleVote(blog)}
        >
          like
        </button>
      </div>

      <div>Added by {author}</div>

      <h3>Comments</h3>
      <NewComment handleSubmit={handleSubmit}/>

      {
        comments.map((comment, index) => {
          return (
            <li key={index}>{comment}</li>
          )
        })
      }
      

    </div>
  )
}

export default BlogView