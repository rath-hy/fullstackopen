import { useSelector, useDispatch } from 'react-redux'
import { voter } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  // const anecdotes = useSelector(state => state.anecdotes)

  const anecdotes = useSelector(state => {
    if (state.filter === 'ALL') {
      return state.anecdotes
    }

    else {
      return state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
    }

  })

  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(voter(id))
  }

  return (
    anecdotes.map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => vote(anecdote.id)}>vote</button>
        </div>
      </div>
    )
  )
}

export default AnecdoteList
