import { useParams } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"

const User = ({user}) => {
  const { name, blogs } = user

  return (
    <div>
      <h1>{name}</h1>
      <h2>added blogs</h2>
      {blogs.map(blog => (
        <li key={blog.id}>
          {blog.title}
        </li>
        ))
      }
    </div>
  )
}

export default User