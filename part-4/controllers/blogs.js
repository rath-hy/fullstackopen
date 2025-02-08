
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const { info } = require('../utils/logger')


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

// const blogSchema = new mongoose.Schema({
//   url: String,
//   title: String,
//   author: String,
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   likes: {
//     type: Number,
//     default: 0,
//   },
// })

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    // console.log("***here's the body:", body)

    const user = await User.findById(body.userId)

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

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'Invalid ID format' });
  }

  const deletedBlog = await Blog.findByIdAndDelete(id)

  if (!deletedBlog) {
    return response.status(404).json({ error: 'Blog post not found' });
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
