import { useState, useEffect, createRef, useContext } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'
import storage from './services/storage'
import Login from './components/Login'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import NotificationContext from './contexts/NotificationContext'
import UserContext from './contexts/UserContext'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

import { Routes, Route, useMatch, Link } from 'react-router-dom'
import UsersView from './views/UsersView'
import UserView from './views/UserView'
import BlogView from './views/BlogView'

import axios from 'axios'

import { 
  Table, 
  Paper, 
  TableContainer,
  TableBody,
  TableRow,
  TableCell,

  AppBar,
  Toolbar,
  Button
} from '@mui/material'




const App = () => {
  const [user, userDispatch] = useContext(UserContext)
  const [notification, dispatch] = useContext(NotificationContext)

  useEffect(() => {
    const user = storage.loadUser()
    if (user) {
      userDispatch({
        type: 'SET',
        payload: user
      })
    }
  }, [])

  const blogFormRef = createRef()


  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: (newBlog) => blogService.create(newBlog),

    //less efficient
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['blogs'] })
    // },

    //more efficient
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
    }
  })

  const updateBlogMutation = useMutation({
    mutationFn: ({id, newBlog}) => blogService.update(id, newBlog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const deleteBlogMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const blogResult = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll(),
    refetchOnWindowFocus: false
  })

  

const notify = (message, type = 'success') => {
  dispatch({
    type: type.toUpperCase(),
    payload: message
  })
  setTimeout(() => {dispatch({type: 'CLEAR'})}, 3000)
}

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      userDispatch({
        type: 'SET',
        payload: user
      })
      storage.saveUser(user)
      notify(`Welcome back, ${user.name}`)
    } catch (error) {
      notify('Wrong credentials', 'error')
    }
  }

  const handleCreate = async (blog) => {
    console.log('blog to create', blog)

    blogFormRef.current.toggleVisibility()
    const newBlog = await newBlogMutation.mutateAsync(blog)
    if (newBlog) {
      notify(`Blog created: ${newBlog.title}, ${newBlog.author}`)
    }
  }

  const handleVote = async (blog) => {
    console.log('updating', blog)
    const updatedBlog = await updateBlogMutation.mutateAsync({
      id: blog.id,
      newBlog: {
        ...blog,
        likes: blog.likes + 1
      }
    })
    notify(`You liked ${updatedBlog.title} by ${updatedBlog.author}`)
  }

  const handleLogout = () => {
    userDispatch({ type: 'LOGOUT' })
    storage.removeUser()
    notify(`Bye, ${user.name}!`)
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await deleteBlogMutation.mutateAsync(blog.id)
      notify(`Blog ${blog.title}, by ${blog.author} removed`)
    }
  }

  const userResult = useQuery({
    queryKey: ['users'],
    queryFn: () => axios.get('http://localhost:3001/api/users').then(response => response.data),
    retry: false
  })

  const userMatch = useMatch('/users/:id')
  const blogMatch = useMatch('/blogs/:id')

  const byLikes = (a, b) => b.likes - a.likes

  const BlogList = () => {
    if (blogs) {
      return (
        <div>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <NewBlog doCreate={handleCreate} />
          </Togglable>

        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {blogs.sort(byLikes).map(blog =>
              <TableRow key={blog.id}>
                <TableCell>
                  <Blog
                    key={blog.id}
                    blog={blog}
                    handleVote={handleVote}
                    handleDelete={handleDelete}
                  />
                </TableCell>
              </TableRow>
            )}
            </TableBody>
          </Table>
        </TableContainer>

          {/* {blogs.sort(byLikes).map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              handleVote={handleVote}
              handleDelete={handleDelete}
            />
          )} */}

          


        </div>
      )
    }
  }

  if (!user) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification notification={notification} />
        <Login doLogin={handleLogin} />
      </div>
    )
  }

  if (blogResult.isLoading) {
    return (
      <div>
        Waiting for blogs...
      </div>
    )
  }

  if (userResult.isLoading) {
    return (
      <div>
        Waiting for users...
      </div>
    )
  }

  const users = userResult.data
  const specificUser = userMatch ? users.find(user => user.id === userMatch.params.id) : null

  const blogs = blogResult.data
  const specificBlog = blogMatch ? blogs.find(blog => blog.id === blogMatch.params.id) : null

  const padding = {
    padding: 3
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />


      <AppBar>
        <Toolbar>
          <Button color='inherit' component={Link} to='/'>
            Blogs
          </Button>
          <Button color='inherit' component={Link} to='/users'>
            Users
          </Button>
          <em>{user.name} logged in</em>
          <button onClick={handleLogout}>
            logout
          </button>
        </Toolbar>
      </AppBar>
{/*       
      <div>
        <Link to='/' style={padding}>Blogs</Link>
        <Link to='/users' style={padding}>Users</Link>

        {user.name} logged in
        <button onClick={handleLogout}>
          logout
        </button>
      </div> */}

      <Routes>
        <Route path='/' element={<BlogList/>}/>
        <Route path='/users' element={<UsersView users={users}/>}/>
        <Route path='/users/:id' element={<UserView user={specificUser}/>}/>
        <Route path='/blogs/:id' element={<BlogView blog={specificBlog} handleVote={handleVote}/>}/>
      </Routes>

    </div>
  )
}

export default App