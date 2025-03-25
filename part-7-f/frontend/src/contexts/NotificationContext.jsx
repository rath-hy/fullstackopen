//import statements
import { createContext, useReducer } from 'react'

//create context
const NotificationContext = createContext()

//reducer function
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SUCCESS':
      return { message: action.payload, type: 'success' }
    case 'ERROR':
      return { message: action.payload }
    case 'CLEAR':
      return null
    default:
      return state
  }
}

//notification context provider; inside: the variables, using the value 
export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

//export default context
export default NotificationContext