import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification.message)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    display: notification ? "block" : "none"
  }
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification