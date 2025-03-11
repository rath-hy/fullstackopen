import { createSlice } from '@reduxjs/toolkit'

const initialState = 'this is a notification'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,

  reducers: {

  }

})

export default notificationSlice.reducer