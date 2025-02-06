import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, getUserData, getLoading } from "../../services/authSlice";
import Logo from "../../assets/images/slaughter-removebg-preview.png";
import Login from "../../pages/Auth/Login";
import Register from "../../pages/Auth/Register";
import { IoMdNotificationsOutline } from "react-icons/io";
import Notification from "../Notification";
import NavProfile from "../NavProfile";
import userIcon from "../../assets/images/user (1).png";
import api from "../../api/axios";
import {
  fetchNotificationById,
  getNotificationById,
  readNotification,
} from "../../services/notificationSlice";
import io from "socket.io-client";
const socket = io.connect(`${api.defaults.baseURL}`);
const Navbar = () => {
  const dispatch = useDispatch();
  const userData = useSelector(getUserData);
  const loading = useSelector(getLoading);

  const [modal, setModal] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profilePic, setProfilePic] = useState(userIcon);
  const [notifications, setNotifications] = useState([]);
  const getNotification = useSelector(getNotificationById);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (userData && userData.image) {
      setProfilePic(`${api.defaults.baseURL}${userData.image}`);
    }
  }, [userData]);

  const openLogin = () => {
    setModal(true);
    setRegisterModal(false);
  };

  const closeModal = (modal) => {
    setModal(modal);
  };

  const openRegister = () => {
    setRegisterModal(true);
    setModal(false);
  };

  const closeRegister = () => {
    setRegisterModal(false);
  };

  const handleNotification = () => {
    setShowNotification(!showNotification);
    setShowProfile(false);
  };

  const handleProfile = () => {
    setShowProfile(!showProfile);
    setShowNotification(false);
  };

  useEffect(() => {
    if (userData) {
      dispatch(fetchNotificationById(userData.id));
    }
  }, [userData, dispatch]);

  useEffect(() => {
    if (userData) {
      const handleAddSuccess = () => {
        dispatch(fetchNotificationById(userData.id));
      };

      // const handleReceivedSuccess = () => {
      //   dispatch(fetchNotificationById(userData.id));
      // };

      socket.on("success_add", handleAddSuccess);
      socket.on("success_notification", handleAddSuccess);
    }

    // Clean up the socket connection and remove the event listener
    return () => {
      socket.off("success_add");
      socket.off("success_notification");
      // socket.disconnect();
    };
  }, [dispatch, userData]);

  useEffect(() => {
    if (getNotification) {
      setNotifications(getNotification);
      const unread = getNotification?.filter(
        (notification) => notification.is_read === 0
      );
      setUnread(unread.length);
    }
  }, [getNotification]);

  const handleNotificationClick = (id) => {
    dispatch(readNotification(id));
    setTimeout(() => {
      dispatch(fetchNotificationById(userData.id));
    }, 1000);
  };

  return (
    <div className="h-16 w-full flex items-center bg-main">
      <div className="mx-5 flex justify-between w-full">
        <div className="flex items-center justify-center leading-4 space-x-2">
          <img
            src={Logo}
            alt=""
            className="h-12 w-12 filter invert brightness-0"
          />
          <div className="text-white">
            <h1 className="text-lg font-semibold leading-tight bg-green-400 bg-clip-text text-transparent drop-shadow-md">
              Slaughter
            </h1>
            <h2 className="text-xs font-medium leading-tight text-gray-300 drop-shadow-sm">
              Management System
            </h2>
          </div>
        </div>

        <div className="flex items-center">
          <ul className="flex gap-5 items-center text-white lg:text-lg text-sm">
            {loading ? (
              <li>Loading...</li>
            ) : userData ? (
              <>
                <li>
                  <div className="relative">
                    {unread > 0 && (
                      <span className="text-sm absolute right-0 top-0 text-white bg-red-600 rounded-full px-1.5">
                        {unread}
                      </span>
                    )}

                    <div
                      onClick={handleNotification}
                      onMouseEnter={handleNotification}
                      className="h-10 w-10 text-white cursor-pointer flex justify-center items-center"
                    >
                      <IoMdNotificationsOutline className="text-3xl " />
                    </div>
                  </div>
                  {showNotification && (
                    <div
                      onMouseLeave={handleNotification}
                      className="absolute z-50 right-5"
                    >
                      <Notification
                        notifications={notifications}
                        handleNotificationClick={handleNotificationClick}
                      />
                    </div>
                  )}
                </li>
                <li className="font-bold">{userData?.firstName}</li>
                <li>
                  <img
                    src={profilePic}
                    onClick={handleProfile}
                    onMouseEnter={handleProfile}
                    alt=""
                    className="h-10 w-10 rounded-full bg-gray-100 cursor-pointer"
                  />
                  {showProfile && (
                    <div
                      onMouseLeave={handleProfile}
                      className="absolute right-5 text-sm text-gray-700"
                    >
                      <NavProfile />
                    </div>
                  )}
                </li>
              </>
            ) : (
              <>
                <li>
                  <button
                    onClick={openLogin}
                    className="px-4 h-10 bg-yellow rounded-lg hover:bg-yellow_hover"
                  >
                    Login
                  </button>
                  {modal && (
                    <Login
                      modal={modal}
                      closeModal={closeModal}
                      openRegister={openRegister}
                    />
                  )}
                </li>
                <li>
                  <button
                    onClick={openRegister}
                    className="px-4 h-10 bg-yellow rounded-lg hover:bg-yellow_hover"
                  >
                    Register
                  </button>
                  {registerModal && (
                    <Register
                      modal={registerModal}
                      closeModal={closeRegister}
                      openLogin={openLogin}
                    />
                  )}
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
