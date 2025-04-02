import { useState } from "react"
import blogService from '../services/blogs'

const NewComment = ({blog, handleSubmit, comment, setComment}) => {


  return (
    <div>
      <form onSubmit={() => handleSubmit(event, blog, comment, setComment)}>
        <input onChange={() => setComment(event.target.value)} value={comment}></input>
        <button type="submit">add comment</button>
      </form>
    </div>
  )
}

export default NewComment