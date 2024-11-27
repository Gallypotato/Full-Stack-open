import { useSelector } from "react-redux";

const Notification = () => {
  const { message, type } = useSelector((state) => state.notification)
  if (message === null) {
    return null;
  }

  const className = type === "error" ? "error" : "notice";

  return <div className={className}>{message}</div>;
};

export default Notification;
