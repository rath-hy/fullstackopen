import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../../requests"


import NotificationContext from "../../NotificationContext"
import { useContext } from "react"


const AnecdoteForm = () => {
  const [notification, setNotification] = useContext(NotificationContext)

  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    // onSuccess: queryClient.invalidateQueries({queryKey: ['anecdotes']})

    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))

      setNotification({ payload: `new anecdote '${newAnecdote.content}' created` })
      setTimeout(() => setNotification({ payload: null}), 2000)
    },

    onError: ({ response }) => {
      setNotification({ payload: response.data.error })
      setTimeout(() => setNotification({ payload: null}), 2000 )
    } 
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({content, votes: 0})
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
