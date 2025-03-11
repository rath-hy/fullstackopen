import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,

  reducers: {
    setNotification(state, action) {
      return action.payload
    },

    removeNotification() {
      return null
    },
  }
})


export const setNotificationWithDelay = (notification, delay = 1) => {
  return async dispatch => {
    dispatch(setNotification(notification))
    setTimeout(() => dispatch(removeNotification()), 1000 * delay)
  }
}

export const { setNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer
