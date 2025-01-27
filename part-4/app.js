const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')

const Blog = require('./models/blog')
const { info, error } = require('./utils/logger')
const utils = require('./utils/config')

const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl).then(() => info('Connected to mongoDB')).catch((error) => info('Error connecting to mongoDB', error.message))

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app



