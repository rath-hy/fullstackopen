import { useState } from 'react'
import { useMatch } from 'react-router-dom'

import { gql, useMutation} from '@apollo/client'
import { updateCache } from '../App'

const NEW_BOOK = gql`
  mutation($title: String, $author: String, $published: Int, $genres: [String]) {
    addBook(title: $title, author: $author, published: $published, genres: $genres, ) {
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

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ createBook ] = useMutation(NEW_BOOK)

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    // console.log('add book...')
    createBook( {
      variables: { title, author, published: +published, genres },
      onError: (error) => {
        
      },
      update: (cache, response) => {
        updateCache(cache, { query: ALL_BOOKS }, response.data.createBook )
      }

    })



    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook