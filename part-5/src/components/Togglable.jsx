import { useState } from 'react'
import PropTypes from 'prop-types'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.showButtonLabel}</button>
      </div>

      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>{props.hideButtonLabel}</button>
      </div>
    </div>
  )
}

Togglable.propTypes = {
  showButtonLabel: PropTypes.string.isRequired,
  hideButtonLabel: PropTypes.string.isRequired
}

export default Togglable
