import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './reducers/filterReducer'
import notificationReducer from './reducers/notificationReducer'

import anecdoteService from './services/anecdotes'
import anecdoteReducer, { setAnecdotes } from './reducers/anecdoteReducer'

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notification: notificationReducer
  }
})

store.subscribe(() => console.log(store.getState()))

anecdoteService.getAll().then(anecdotes => 
  store.dispatch(setAnecdotes(anecdotes))
)

export default store