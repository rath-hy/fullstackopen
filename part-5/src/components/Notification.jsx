const Notification = ({ message, type }) => {
  const errorStyle = {
    color: 'blue',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (type === 'success') {
    errorStyle.color = 'green'
  }

  else if (type === 'error') {
    errorStyle.color = 'red'
  }

  if (message === null) {
    return null
  }

  return (
    <div style={errorStyle}>
      {message}
    </div>
  )
}

export default Notification