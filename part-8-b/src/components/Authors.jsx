import { gql, useQuery, useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`


const EDIT_AUTHOR = gql`
  mutation EditAuthor($name: String, $setBornTo: Int) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      bookCount
    }
  }
`

const Authors = (props) => {
  const [ author, setAuthor ] = useState('')
  const [ birthyear, setBirthyear ] = useState('')

  const [ editBirthyear ] = useMutation(EDIT_AUTHOR)

  const submit = (event) => {
    event.preventDefault()

    console.log('*** author', author)

    if (author) {
      editBirthyear( {
        variables: { name: author, setBornTo: +birthyear }
      })
    }

    setAuthor('')
    setBirthyear('')
  }

  const result = useQuery(ALL_AUTHORS, {
    pollInterval: 2000
  })

  // useEffect(() => {
  //   if (result.data?.allAuthors?.length) {
  //     setAuthor(result.data.allAuthors[0].name)
  //   }

  // }, [result.data])


  if (!props.show) {
    return null
  }

  if (result.loading) {
    return (
      <div>
        loading...
      </div>
    )
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <select value='Fyodor Dostoevsky' onChange={(event) => setAuthor(event.target.value)}>
            {authors.map(author => (
              <option value={author.name} key={author.name}>{author.name}</option>
            ))}
          </select>
        </div>

        <div>
          birthyear
          <input
            value={birthyear} 
            onChange={(event) => setBirthyear(event.target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>


    </div>
  )
}

export default Authors
