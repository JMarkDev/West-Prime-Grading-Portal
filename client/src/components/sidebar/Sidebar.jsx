import { useEffect, useState } from "react";
import { logoutUser } from "../../services/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../services/authSlice";
import { Link, useLocation } from "react-router-dom";
import { FaUsers, FaRegCalendarAlt, FaChalkboardTeacher } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { RiPieChart2Fill } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import Logo from "../../assets/images/west_prime_logo-removebg-preview.png";
import PropTypes from "prop-types";
import rolesList from "../../constants/rolesList";
import { PiStudent } from "react-icons/pi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

const Sidebar = ({ sidebar, handleBurger }) => {
  const dispatch = useDispatch();
  const userData = useSelector(getUserData);
  // const { userData } = useContext(AuthContext);
  const location = useLocation();
  const [sidebarLinks, setSidebarLinks] = useState([]);
  const role = userData?.role;
  const [openSublinks, setOpenSublinks] = useState({});
  // const role = "faculty";

  const adminLinks = [
    {
      title: "Dashboard",
      path: "/admin-dashboard",
      src: <RiPieChart2Fill />,
    },
    {
      title: "Students",
      path: "/students",
      src: <PiStudent />,
    },
    {
      title: "Class",
      path: "/class",
      src: <FaUsers />,
    },
    {
      title: "Instructor",
      path: "/instructors",
      src: <FaChalkboardTeacher />,
    },
    {
      title: "Subjects",
      path: "/subjects",
      src: <HiOutlineClipboardDocumentList />,
    },
    {
      title: "Course",
      path: "/courses",
      src: <HiOutlineClipboardDocumentList />,
    },
    {
      title: "School Year",
      path: "/school-year",
      src: <FaRegCalendarAlt />,
    },

    {
      title: "Reports",
      path: "/reports",
      src: <TbReportAnalytics />,
    },
    {
      title: "Admin",
      path: "/admin",
      src: <MdOutlineAdminPanelSettings />,
    },
  ];

  const instructorsLinks = [
    {
      title: "Students",
      path: "/students",
      src: <PiStudent />,
    },
    {
      title: "Student Grades",
      path: "/student-grades",
      src: <FaUsers />,
    },
  ];

  const studentLinks = [
    {
      title: "Grades",
      path: "/grades",
      src: <FaUsers />,
    },
  ];

  useEffect(() => {
    if (role === rolesList.admin) {
      setSidebarLinks(adminLinks);
    } else if (role === rolesList.instructor) {
      setSidebarLinks(instructorsLinks);
    } else {
      setSidebarLinks(studentLinks);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const toggleSublinks = (title) => {
    setOpenSublinks((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };
  return (
    <>
      {sidebar && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={handleBurger}
        ></div>
      )}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-main rounded-br-lg transition-transform transform ${
          sidebar ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:transform-none`}
        aria-label="Sidebar"
      >
        <div className="fixed w-64 h-full px-3 py-4 overflow-y-auto bg-main  rounded-xl dark:bg-gray-800 ">
          <Link
            to="/admin-dashboard"
            className="flex items-center justify-center ps-2.5 mb-5"
          >
            <img src={Logo} className="h-16 me-3 text-center " alt="Logo" />
          </Link>
          <ul className="space-y-2 font-medium">
            {sidebarLinks.map((menu, index) => (
              <li
                key={index}
                // className={`${
                //   !isUserManagementOpen
                //     ? "last:absolute last:bottom-10 last:w-[230px] "
                //     : ""
                // }`}
              >
                {menu.sublinks ? (
                  <div>
                    <button
                      onClick={() => toggleSublinks(menu.title)}
                      className="flex items-center text-nowrap justify-between w-full p-2 rounded-lg text-white hover:text-white hover:bg-main_hover dark:hover:bg-gray-700 group"
                    >
                      <div className="flex items-center">
                        <span className="text-2xl">{menu.src}</span>
                        <span className="ms-3">{menu.title}</span>
                      </div>
                      <span className="text-xl">
                        {openSublinks[menu.title] ? (
                          <FiChevronDown />
                        ) : (
                          <FiChevronRight />
                        )}
                      </span>
                    </button>
                    {openSublinks[menu.title] && (
                      <ul className="pl-8 mt-2 space-y-2">
                        {menu.sublinks.map((submenu, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={submenu.path}
                              className={`${
                                location.pathname === submenu.path &&
                                "bg-blue-800 text-white"
                              } flex items-center p-2 text-white rounded-lg  hover:text-white hover:main_hover dark:hover:bg-gray-700 group`}
                            >
                              {submenu.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    // onClick={handleLogout}
                    to={menu.path}
                    className={`${
                      location.pathname === menu.path &&
                      "bg-main_hover text-white"
                    } flex items-center p-2 text-nowrap  rounded-lg text-white hover:text-white hover:bg-main_hover dark:hover:bg-gray-700 group`}
                  >
                    <span className="text-2xl">{menu.src}</span>
                    <span className="ms-3">{menu.title}</span>
                  </Link>
                )}
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className={
                  "w-[230px] mt-20 flex items-center p-2 text-white rounded-lg hover:text-white hover:bg-main_hover dark:hover:bg-gray-700 group"
                }
              >
                <span className="text-2xl">
                  <BiLogOut />
                </span>
                <span className="ms-3">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  sidebar: PropTypes.bool,
  handleBurger: PropTypes.func,
};

export default Sidebar;
