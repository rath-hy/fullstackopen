const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    me: async (root, args, context) => {
      return context.currentUser
    },

    bookCount: async () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      console.log('all books')

      const { author, genre } = args

      const allBooks = await Book.find({}).populate('author')

      return allBooks.filter(book => {
        const byAuthor = !author || author === book.author.name
        const byGenre = !genre || book.genres.includes(genre)
        return byAuthor && byGenre
      })
    },

    allAuthors: async () => {
      console.log('all authors')

      const allAuthors = await Author.find({})
      const allBooks = await Book.find({}).populate('author')
      const result = allAuthors.map(author => {
        return {
          name: author.name,
          bookCount: allBooks.filter(book => book.author.name === author.name).length,
          born: author.born || 0
        }
      })

      return result
    },
  },


  Mutation: {
    createUser: async (root, args) => {
      const user = new User({
        ...args
      })

      try {
        await user.save()
      } catch (error) {
        throw new GraphQLError('creating new user failed', {
          code: 'BAD_USER_INPUT',
          invalidArgs: args.username,
          error
        })
      }

      return user
    },

    login: async (root, args) => {

      const user = await User.findOne({username: args.username})

      if (!user || args.password !== 'sex') {
        throw new GraphQLError('wrong credentials', {
          code: 'BAD_USER_INPUT'
        })
      }

      const userForToken = {
        username: args.username,
        id: user._id.toString()
      }

      console.log('userForToken', userForToken)

      const token = {
        value: jwt.sign(userForToken, process.env.JWT_SECRET)
      }

      return token

    },


    resetAuthors: async () => {
      try {
        await Author.deleteMany({})

        const authorSavePromises = authors.map(author => {
          const newAuthor = new Author({
            ...author,
            id: null
          })
          return newAuthor.save()
        })

        const result = await Promise.all(authorSavePromises)
        return result
      } catch (error) {
        console.error('error resetting authors', error)
      }
    },


    resetBooks: async () => {

      const allAuthors = await Author.find({})
      const authorNameMap = new Map(allAuthors.map(author => [author.name, author]))

      try {
        await Book.deleteMany({})

        const bookSavePromises = books.map(book => {
          const bookAuthor = authorNameMap.get(book.author)
          const newBook = new Book({
            ...book,
            author: bookAuthor,
            id: null
          })
          return newBook.save()
        })

        const result = await Promise.all(bookSavePromises)
        return result
      } catch (error) {
        console.error(error, 'error resetting books')
      }
    },

    //modify here for new books
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const allAuthors = await Author.find({})
      let author = allAuthors.find(a => a.name === args.author) 

      if (!author) {
        author = await resolvers.Mutation.addAuthor(null, { name: args.author } )
      }

      const newBook = new Book({
        ...args,
        author: author
      })

      console.log('*** new book', newBook)

      try {
        await newBook.save()
      } catch (error) {
        throw new GraphQLError('save book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: newBook})

      return newBook
    },

    addAuthor: async (root, args) => {
      const newAuthor = new Author ({
        ...args,
      })

      try {
        return await newAuthor.save()
      } catch (error) {
        throw new GraphQLError('save author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const updatedAuthor = await Author.findOneAndUpdate(
        { name: args.name }, 
        { born: args.setBornTo }, 
        { new: true}
      )

      if (!updatedAuthor) {
        throw new GraphQLError('author not found', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      return updatedAuthor
    }
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

// let authors = [
//   {
//     name: 'Robert Martin',
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821
//   },
//   { 
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   { 
//     name: 'Sandi Metz', // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ]

// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: 'Robert Martin',
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: 'Robert Martin',
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ['agile', 'patterns', 'design']
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: 'Martin Fowler',
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: 'Joshua Kerievsky',
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'patterns']
//   },  
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: 'Sandi Metz',
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'design']
//   },
//   {
//     title: 'Crime and punishment',
//     published: 1866,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'crime']
//   },
//   {
//     title: 'Demons',
//     published: 1872,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'revolution']
//   },
// ]

module.exports = resolvers