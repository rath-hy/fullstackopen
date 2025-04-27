import { useState, useEffect } from "react"
import { useMutation, gql } from "@apollo/client"

const LOGIN = gql`
mutation Mutation($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`

const Login = ( { show, setToken, setPage }) => {
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      //handle error here
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('bookstore-user-token', token)
    }
  }, [result.data])


  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    login({ variables: { username, password } })

    setUsername('')
    setPassword('')

    setPage("authors")
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={submit}> 
        <div>
          <input 
            value={username}
            onChange={({target}) => setUsername(target.value)}
          />
        </div>

        <div>
          <input 
            type='password'
            value={password}
            onChange={({target}) => setPassword(target.value)}
          />
        </div>

        <div>
          <button type='submit'>Log in</button>
        </div>
      </form>
    </div>
  )
  
}


export default Login


