import { useState } from 'react'

import {
  TextField,
  Button
} from '@mui/material'

const Login = ({ doLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    doLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleLogin}>
      <TextField 
        size='small'
        id='outlined-basic' 
        data-testid='username' 
        type='text' 
        label='username' 
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField 
        size='small'
        id='outlined-basic' 
        data-testid='password' 
        type='password' 
        label='password' 
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button 
        size='medium' 
        type="submit" 
        variant="contained"
      >
        Login
      </Button>
      {/* <input type="submit" value="Login" /> */}
    </form>
  )
}

export default Login