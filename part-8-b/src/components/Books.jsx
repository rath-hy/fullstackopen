import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'

// const ALL_BOOKS = gql`
//   query {
//     allBooks {
//       title
//       author {
//         name
//         born
//       }
//       published
//       genres
//     }
//   }
// `

// const [bookData, setBookData] = useState(null)

// const result = useQuery(ALL_BOOKS, {
//   pollInterval: 2000
// })

// if (result.loading) {
//   return <div>loading...</div>
// }


const ALL_GENRES = gql`
  query {
    allBooks {
      genres
    }
  }
`

const FILTERED_BOOKS = gql`
  query($genre: String, $author: String) {
    allBooks(genre: $genre, author: $author) {
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



const Books = (props) => {
  const [filter, setFilter] = useState(null)
  // const [uniqueGenreList, setUniqueGenreList] = useState(null)

  const filteredBooksResult = useQuery(FILTERED_BOOKS, {
    variables: { genre: filter },
    pollInterval: 2000,
  })

  const allGenresResult = useQuery(ALL_GENRES)

  if (!props.show) {
    return null
  }

  if (filteredBooksResult.loading || allGenresResult.loading) {
    return <div>loading...</div>
  }

  const books = filteredBooksResult.data?.allBooks || []
  
  const uniqueGenreList = [...new Set(allGenresResult.data.allBooks.flatMap(book => book.genres))]

  const handleClick = (genre) => {
    setFilter(genre)
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map(a => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>


      <button onClick={() => handleClick(null)}>
        all genres
      </button>

      {
        uniqueGenreList.map(genre => (
          <button key={genre} onClick={() => handleClick(genre)}>
            {genre}
          </button>
        ))
      }

    </div>
  )
}

export default Books
