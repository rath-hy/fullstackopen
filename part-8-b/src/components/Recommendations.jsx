import { gql, useQuery } from "@apollo/client"

const ME = gql`
  query {
    me {
      username
      id
      favoriteGenre
    }
  }
`

const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
        born
      }
      published
      genres
    }
  }
`


const Recommendations = (props) => {
  if (!props.show) {
    return null
  }

  const booksResult = useQuery(ALL_BOOKS, {
    pollInterval: 2000
  })

  if (booksResult.loading) {
    return <div>loading...</div>
  }

  const books = booksResult.data.allBooks

  // console.log('books', books)

  const meResult = useQuery(ME, {
    pollInterval: 2000
  })

  if (meResult.loading) {
    return <div>loading...</div>
  }

  const me = meResult.data.me


  return (
    <div>
      <h2>recommendations</h2>

      books in your favorite genre <b>{me.favoriteGenre}</b>

      {
        <table>
          <tbody>
            <tr>
              <th>title</th>
              <th>author</th>
              <th>published</th>
            </tr>

            {
              books.filter(book => book.genres.includes(me.favoriteGenre)).map(book => (
                <tr key={book.title}>
                  <td>{book.title}</td>
                  <td>{book.author.name}</td>
                  <td>{book.published}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      }



    </div>
  )
}

export default Recommendations


