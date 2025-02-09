const User = require('../models/user')
const jwt = require('jsonwebtoken')
const logger = require('./logger')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
}

const tokenExtractor = (request, response, next) => {
    request.token = getTokenFrom(request)
    next()
}

const userExtractor = async (request, response, next) => {
    try {
        if (!request.token) {
            return response.status(401).json({ error: 'token missing' })
        }
        
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        
        if (!decodedToken.id) {
            return response.status(400).json({ error: 'token invalid' })
        }

        request.user = await User.findById(decodedToken.id)
        next()
    } catch (error) {
        next(error)
    }
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
      return response.status(400).json({
        error: 'expected `username` to be unique'
      })
    } else if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({
        error: 'invalid token'
      })
  
    } else if (error.name === 'TokenExpiredError') {
      return response.status(401).json({
        error: 'token expired'
      })
    }
  
    next(error)
}

module.exports = { tokenExtractor, userExtractor, errorHandler }
