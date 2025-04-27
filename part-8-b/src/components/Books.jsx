import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'

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

const Books = (props) => {
  const [filter, setFilter] = useState('')

  const result = useQuery(ALL_BOOKS, {
    pollInterval: 2000
  })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  var genreList = []

  books.forEach(book => {
    book.genres.forEach(genre => {
      genreList = genreList.concat(genre)
    })
  });

  const uniqueGenreList = [...new Set(genreList)]

  const handleClick = (genre) => {
    setFilter(genre)
  }


  //get a list of unique genres (remove duplicates)
  //for each item in the list, create a button
  //same changeHandler -- involving making a mutation with the filter param added

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
          {books.filter(book => filter ? book.genres.includes(filter) : true).map((a) => (
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
