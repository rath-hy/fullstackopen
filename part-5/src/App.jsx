import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'

import loginService from './services/login'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') //why empty strings and not null
  const [password, setPassword] = useState('')
  
  const [user, setUser] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      //error message stuff
    }

    console.log('Logging in with', username, password)
  }


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  if (user === null) {
    return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input 
          type="text"
          value={username}
          name="Username"
          onChange={ ({target}) => {setUsername(target.value)} }
          />
        </div>
        
        <div>
          password
          <input 
            type="text"
            value={password}
            name="Username"
            onChange={ ({target}) => {setPassword(target.value)} }
          />
        </div>

        <div>
          <button type="submit">login</button>
        </div>
      </form>
    </div>
    )
  }

  // console.log('user2', user)

  return (
    <div>
      <h2>blogs</h2>
       {user.name} logged in

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App