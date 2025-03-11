import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const sortByVotes = (anecdotes) => anecdotes.sort((a, b) => b.votes - a.votes) 

export const voter = (id) => {
  return {
    type: 'VOTE',
    payload: { id }
  }
}

export const creator = (content) => {
  return {
    type: 'CREATE',
    payload: {
      content
    }
  }
}

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],

  reducers: {
    appendAnecdote(state, action) {
      console.log('action payload', action.payload)
      state.push(action.payload)
    },

    setAnecdotes(state, action) {
      return sortByVotes(action.payload)
    }
  }
})

export const voteAnecdote = id => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    const updatedAnecdotes = sortByVotes(anecdotes.map(anecdote => 
          anecdote.id === id 
          ? {...anecdote, votes: anecdote.votes + 1} 
          : anecdote))
    const updatedAnecdote = updatedAnecdotes.find(x => x.id === id)
    await anecdoteService.update(id, updatedAnecdote)
    dispatch(setAnecdotes(updatedAnecdotes))
  }
}

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const { appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer
