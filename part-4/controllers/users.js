const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (password.length < 3) {
    return response.status(400).json({ error: 'password too short' })
  }

  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)

  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return response.status(400).json({ error: error.message });
    }

    //else statement needed later
  }

  
})


usersRouter.get('/', async (request, response) => {
    const users = await User
      .find({})
      .populate('blogs', { url: 1, title: 1, author: 1 })

    response.json(users)
})

module.exports = usersRouter