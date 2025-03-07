import { useDispatch } from 'react-redux'
import { creator } from '../reducers/anecdoteReducer'


const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    dispatch(creator(content))
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



