const User = require('../models/user')
const jwt = require('jsonwebtoken')

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
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(400).json({ error: 'token invalid' })
    }
    request.user = await User.findById(decodedToken.id)
    next()
}



module.exports = { tokenExtractor, userExtractor }
