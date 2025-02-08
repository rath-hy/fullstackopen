
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const { info } = require('../utils/logger')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
      .find({})
      .populate('user', { username: 1, name: 1 })
      .then(blogs => {
        response.json(blogs)
      })
})

blogsRouter.get('/gets/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(400).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      ...body,
      user: user.id
    })

    if (!blog.title) {
      return response.status(400).json({ error: 'Title is required' });
    }

    if (!blog.url) {
      return response.status(400).json({ error: 'Title is required' });
    }

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

//deleting a blog is possible only if the token sent with the request is the same as that of the blog's creator.

/* 
 1. with the delete link, find id of the blog to delete
 2. from the found blog, find its user
 3. from the token, find the user
 4. compare users from parts 2 and 3
*/

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'Invalid ID format' });
  }

  const blogToDelete = await Blog.findById(id)

  if (!blogToDelete) {
    return response.status(404).json({ error: 'Blog post not found' });
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(400).json({ error: 'token invalid' })
  }

  if (blogToDelete.user.toString() === decodedToken.id) {
    console.log('*** blogToDelete.user', blogToDelete.user.toString())
    console.log('*** decodedToken.id', decodedToken.id)

    const deletedBlog = await Blog.findByIdAndDelete(id)
  }

  return response.status(204).end();
})

//MISSING ERROR HANDLING
blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id

  //make sure id is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'Invalid ID format' });
  }

  const originalVersion = await Blog.findById(id)

  //if object doesn't exist
  if (!originalVersion) {
    return response.status(404).json({ error: 'Blog post not found'})
  }

  const updatedVersion = {
    likes: request.body.likes
  }

  const returnedVersion = await Blog.findByIdAndUpdate(id, updatedVersion, { new: true })
  response.json(returnedVersion)
})

module.exports = blogsRouter
