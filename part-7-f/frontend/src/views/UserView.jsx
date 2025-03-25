import { Link } from 'react-router-dom'

const UserView = ({user}) => {
  if (!user) {
    return null
  }

  const { name, blogs } = user

  return (
    <div>
      <h1>{name}</h1>
      <h2>added blogs</h2>
      {blogs.map(blog => (
        <li key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title}
          </Link>
        </li>
        ))
      }
    </div>
  )
}

export default UserView