import PropTypes from 'prop-types';
import { useReducer, createContext, useContext } from 'react'

const notificationReducer = (state, action) => {
  if (action.payload) {
    return action.payload
  }
  return null
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, setNotification] = useReducer(notificationReducer, null)
  
  return (
      <NotificationContext.Provider value={[notification, setNotification]}>
        {props.children}
      </NotificationContext.Provider>
    )
}

NotificationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export default NotificationContext