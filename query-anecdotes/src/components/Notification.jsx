import React, {useEffect} from 'react'
import { useNotification, hideNotification } from '../notificationContext'

const Notification = () => {
  const { state, dispatch } = useNotification()

  useEffect(() => {
    if (state.visible) {
      const timer = setTimeout(() => {
        dispatch(hideNotification())
      }, 3000) // Hide notification after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [state.visible, dispatch])

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  if (!state.visible) return null

  return (
    <div style={style}>
      {state.message}
    </div>
  )
}

export default Notification
