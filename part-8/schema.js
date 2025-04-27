const typeDefs = `
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!

    me: User,
  }

  type Book {
    title: String!
    author: Author!
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

    resetAuthors: [Author]
    resetBooks: [Book]

    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }

  type Subscription {
    bookAdded: Book!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
`

module.exports = typeDefs

