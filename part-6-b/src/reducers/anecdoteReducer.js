import { createSlice } from '@reduxjs/toolkit'

// const anecdotesAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ]

// const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0
//   }
// }

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

// const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],

  reducers: {
    voteAnecdote(state, action) {
      return sortByVotes(state.map(anecdote => 
        anecdote.id === action.payload 
        ? {...anecdote, votes: anecdote.votes + 1} 
        : anecdote))
    },

    createAnecdote(state, action) {
      console.log('in reducer, action.payload', action.payload)
      return sortByVotes(state.concat(action.payload))
    },

    appendAnecdote(state, action) {
      state.push(action.payload)
      return sortByVotes(state) // ?
    },

    setAnecdotes(state, action) {
      return sortByVotes(action.payload)
    }

  }
})

export const { voteAnecdote, createAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer
