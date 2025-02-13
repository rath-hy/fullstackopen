import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'

const NewBlogForm = ({
  handleSubmit,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  title,
  author,
  url
}) => {
  return (
    <div>
        <form onSubmit={handleSubmit}> 
        <div>
          Title 
          <input 
            type="text" 
            value={title}
            name="Title"
            onChange={handleTitleChange}
          />
        </div>
          Author
            <input 
              type="text" 
              value={author}
              name="Author"
              onChange={handleAuthorChange}
            />
        <div>
          Url
            <input 
              type="text" 
              value={url}
              name="Url"
              onChange={handleUrlChange}
            />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') //why empty strings and not null
  const [password, setPassword] = useState('')
  
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)


  const [newBlogFormVisible, setNewBlogFormVisible] = useState(false)

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
        <div style={showWhenVisible}>
          <NewBlogForm 
              handleSubmit={handleCreateNewBlog}
              handleTitleChange={({target}) => setTitle(target.value)}
              handleAuthorChange={({target}) => setAuthor(target.value)}
              handleUrlChange={({target}) => setUrl(target.value)}
              title={title}
              author={author}
              url={url}/>
        </div>
        <button style={hideWhenVisible} onClick={() => setNewBlogFormVisible(true) }>new note</button>
        <button style={showWhenVisible} onClick={() => setNewBlogFormVisible(false)}>cancel</button>
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