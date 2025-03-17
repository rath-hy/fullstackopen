import NotificationContext from "../../NotificationContext"
import { useContext } from "react"

const Notification = (props) => {
  const [notification, setNotification] = useContext(NotificationContext)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  if (!notification) {
    return (<> </>)
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
