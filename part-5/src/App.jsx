import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') //why empty strings and not null
  const [password, setPassword] = useState('')
  
  const [user, setUser] = useState(null)

  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)


  const [newBlogFormVisible, setNewBlogFormVisible] = useState(false)

  const updateBlogLikes = async (id, newBlog) => {
    try {
      const returnedBlog = await blogService.update(id, newBlog)
      setBlogs(blogs.map(blog => blog.id === id ? returnedBlog : blog))
      // setBlogs(blogs.sort())
    } catch (exception) {

    }
  }

  const handleCreateNewBlog = async () => {
    event.preventDefault()

    try {
      const newBlog = {
        url,
        title,
        author
      }
  
      const response = await blogService.create(newBlog)
      setBlogs([...blogs, response])

      const successfulBlogAdditionMessage = `A new blog "${title}" by ${author} added`
  
      setTitle('')
      setAuthor('')
      setUrl('')

      setNotificationType('success')
      setNotificationMessage(successfulBlogAdditionMessage)
      setTimeout(() => {setNotificationMessage(null)}, 1500)

      setNewBlogFormVisible(false)

    } catch (exception) {
      setNotificationType('error')
      setNotificationMessage('Blog addition failed.')
      setTimeout(() => {setNotificationMessage(null)}, 1500)
    }
  }



  const newBlogForm = () => {
    const hideWhenVisible = { display : newBlogFormVisible ? 'none' : '' }
    const showWhenVisible = { display : newBlogFormVisible ? '' : 'none' }

    return (
      <div>
        <Togglable showButtonLabel='new blog' hideButtonLabel='cancel'>
          <BlogForm handleSubmit={handleCreateNewBlog}/>
        </Togglable>
      </div>
    )
  }
    
    


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

      setNotificationType('success')
      setNotificationMessage('successfully logged in')
      setTimeout(() => {setNotificationMessage(null)}, 1500)

    } catch (exception) {
      setNotificationType('error')
      setNotificationMessage('invalid username or password')
      setTimeout(() => {setNotificationMessage(null)}, 1500)
    }
  }

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

  const blogsList = () => {
    return (
      blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} updateBlogLikes={updateBlogLikes}/>
      )
    )
  }

  const logout = () => {
    window.localStorage.removeItem('loggedInBlogAppUser')
    setUser(null)
  }

  const logoutButton = () => (
    <button type="submit" onClick={logout}>Log Out</button>
  )


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
      <Notification type={notificationType} message={notificationMessage}/>
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