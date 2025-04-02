import ReactDOM from 'react-dom/client'
import App from './App'
import React from 'react'

//new imports
import { NotificationContextProvider } from './contexts/NotificationContext'
import { UserContextProvider } from './contexts/UserContext'
import { QueryClient, QueryClientProvider }  from '@tanstack/react-query'

const queryClient = new QueryClient()

import { BrowserRouter as Router } from 'react-router-dom'

import { Container } from '@mui/material'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Container>
    <Router>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <NotificationContextProvider>
          <App />
        </NotificationContextProvider>
      </UserContextProvider>
    </QueryClientProvider>
  </Router>

  </Container>

)