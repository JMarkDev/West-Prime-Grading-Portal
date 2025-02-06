import PropTypes from "prop-types";
import { useFormat } from "../hooks/useFormatDate";
import { useNavigate } from "react-router-dom";

const Notification = ({ notifications, handleNotificationClick }) => {
  const { dateFormat } = useFormat();
  const navigate = useNavigate();

  return (
    <div className="relative z-100 w-[320px]  shadow-lg bg-white rounded-lg ">
      <h1 className="text-gray-800 p-2 font-bold border-b border-gray-200 md:text-lg">
        Notifications
      </h1>
      <div className="h-[400px] rounded-b-lg  overflow-y-auto">
        <ul className="bg-gray-200">
          {notifications.length === 0 && (
            <li className="p-4 text-sm text-gray-700">No notifications</li>
          )}
          {notifications?.map(
            ({ message, createdAt, is_read, transactionId, id }) => (
              <li
                key={id}
                onClick={() => {
                  handleNotificationClick(id);
                  navigate(`/transaction/${transactionId}`);
                }}
                className={`border-b border-gray-300 ${
                  is_read === 1 ? "bg-white" : "bg-gray-200"
                }  hover:bg-gray-200 cursor-pointer p-4 text-sm`}
              >
                <p className="font-semibold text-gray-700">{message}</p>
                <p className="text-gray-500 border-gray-300 text-sm">
                  {dateFormat(createdAt)}
                </p>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

Notification.propTypes = {
  notifications: PropTypes.array,
  handleNotificationClick: PropTypes.func,
};

export default Notification;
