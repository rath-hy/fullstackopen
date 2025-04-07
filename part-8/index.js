const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
*/


let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Book {
    title: String!
    author: String!
    published: String!
    genres: [String!]!
  }


  type Author {
    name: String
    bookCount: Int
    born: Int
  }

  type Mutation {
    addBook(title: String, author: String, published: Int, genres:[String]): Book
    addAuthor(name: String, born: Int): Author
    editAuthor(name: String, setBornTo: Int): Author
  }
`


const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      const { author, genre } = args

      return books.filter(book => {
        const byAuthor = !author || book.author === author
        const byGenre = !genre || book.genres.includes(genre)
        return byAuthor && byGenre
      })
    },

    allAuthors: () => {
      const data = authors.map(author => {
        return {
          ...author,
          bookCount: books.filter(book => book.author === author.name).length
        }
      }
    )

    return data
    }
  },


  Mutation: {
    addBook: (root, args) => {
      const author = authors.find(a => a.name === args.author)

      if (!author) {
        resolvers.Mutation.addAuthor(null, { name: args.author } )
      }

      const newBook = {
        ...args,
        id: uuid()
      }
      books = books.concat(newBook)
      return newBook
    },

    addAuthor: (root, args) => {
      const newAuthor = {
        ...args,
        id: uuid()
      }
      authors = authors.concat(newAuthor)
      return newAuthor
    },

    editAuthor: (root, args) => {
      const authorToUpdate = authors.find(author => author.name === args.name)

      if (!authorToUpdate) {
        return null
      }
      
      const updatedAuthor = {...authorToUpdate, born: args.setBornTo}
      authors = authors.map(author => author.name === args.name ? updatedAuthor : author )
      return updatedAuthor
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})