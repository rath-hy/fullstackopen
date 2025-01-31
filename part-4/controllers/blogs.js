
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const { info } = require('../utils/logger')


blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
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

blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)

    if (!blog.title) {
      return response.status(400).json({ error: 'Title is required' });
    }

    if (!blog.url) {
      return response.status(400).json({ error: 'Title is required' });
    }
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
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

//- - - - - - - - - - - - - - - - - -

// app.put('/api/notes/:id', (request, response, next) => {
//   const body = request.body

//   const note = {
//     content: body.content,
//     important: body.important,
//   }

//   Note.findByIdAndUpdate(request.params.id, note, { new: true })
//     .then(updatedNote => {
//       response.json(updatedNote)
//     })
//     .catch(error => next(error))
// })



module.exports = blogsRouter
