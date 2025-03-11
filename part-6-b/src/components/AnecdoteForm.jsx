import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    dispatch(createAnecdote(content))

    const notification = `added new blog`
    dispatch(setNotification(notification))
  }

    return (<>
        <h2>Create new</h2>
        <form onSubmit={addAnecdote}>
          <div><input name='anecdote'/></div>
          <button>create</button>
        </form>
      </>)
}

export default AnecdoteForm



