const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')



const Blog = require('./models/blog')
const { info, error } = require('./utils/logger')
const utils = require('./utils/config')

const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl).then(() => info('Connected to mongoDB')).catch((error) => info('Error connecting to mongoDB', error.message))


app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

module.exports = app



