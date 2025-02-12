import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'

import loginService from './services/login'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') //why empty strings and not null
  const [password, setPassword] = useState('')
  
  const [user, setUser] = useState(null)


  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreateNewBlog = async () => {
    event.preventDefault()

    const newBlog = {
      url,
      title,
      author
    }

    const response = await blogService.create(newBlog)
    setBlogs([...blogs, response])

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const newBlogForm = () => (
    <form onSubmit={handleCreateNewBlog}> 

      <div>
        Title 
        <input 
          type="text" 
          value={title}
          name="Title"
          onChange={ ({target}) => setTitle(target.value)  }
        />

      </div>
        Author
          <input 
            type="text" 
            value={author}
            name="Author"
            onChange={ ({target}) => setAuthor(target.value)  }
          />

      <div>
        Url
          <input 
            type="text" 
            value={url}
            name="Url"
            onChange={ ({target}) => setUrl(target.value)  }
          />
      </div>


      <div>
        <button type="submit">submit</button>
  
      </div>

    </form>
  )

  const loginForm = () => (
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
        type="password"
        value={password}
        name="Password"
        onChange={ ({target}) => {setPassword(target.value)} }
      />
    </div>

    <div>
      <button type="submit">login</button>
    </div>
  </form>
  )

  const blogsList = () => (
    blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    )
  )

  const logout = () => {
    window.localStorage.removeItem('loggedInBlogAppUser')
    setUser(null)
  }

  const logoutButton = () => (
    <button type="submit" onClick={logout}>Log Out</button>
  )

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedInBlogAppUser', JSON.stringify(user)
      )


      blogService.setToken(user.token)

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

  useEffect(() => {
    const loggedInBlogAppUserJSON = window.localStorage.getItem('loggedInBlogAppUser')
    if (loggedInBlogAppUserJSON) {
      const user = JSON.parse(loggedInBlogAppUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  return (
    <div>
      {
        user === null ?
          <div>
            <h2>log in to application</h2>
            {loginForm()}
          </div>
           :
          <div>
              <p>{user.name} logged in {logoutButton()}</p>
              {newBlogForm()}
              <br/>
              {blogsList()}
          </div>
      }
    </div>
  )
}

export default App