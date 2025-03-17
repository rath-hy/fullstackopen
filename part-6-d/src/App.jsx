import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { getAnecdotes, updateAnecdote } from '../requests'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import NotificationContext from '../NotificationContext'
import { useContext } from 'react'

const App = () => {
  const [notification, setNotification] = useContext(NotificationContext)
  
  const queryClient = useQueryClient()

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({queryKey: ['anecdotes']})
    // },

    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      const updatedAnecdotes = anecdotes.map(anecdote => 
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote)
      queryClient.setQueryData(['anecdotes'], updatedAnecdotes)
    }
  })

  const handleVote = (anecdote) => {
    voteMutation.mutate({...anecdote, votes: anecdote.votes + 1})

    setNotification({ payload: `voted for '${anecdote.content}'` })
    setTimeout( () => setNotification({ payload: null}), 2000 )

  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })



  if (result.isLoading) {
    return <div>is loading</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }


  // const anecdotes = [
  //   {
  //     "content": "If it hurts, do it more often",
  //     "id": "47145",
  //     "votes": 0
  //   },
  // ]

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />


      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
