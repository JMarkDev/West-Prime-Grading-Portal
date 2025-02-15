import PropTypes from "prop-types";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaClipboardCheck,
} from "react-icons/fa";

const Cards = ({ data }) => {
  const icons = [
    <FaUserGraduate key="total-students" size={30} className="text-blue-500" />, // Total Students
    <FaChalkboardTeacher
      key="total-instructors"
      size={30}
      className="text-green-500"
    />, // Total Instructors
    <FaBook key="total-subjects" size={30} className="text-yellow-500" />, // Total Subjects
    <FaClipboardCheck key="total-grades" size={30} className="text-red-500" />, // Total Grades Recorded
  ];

  const colors = [
    "#e3f2fd", // Light Blue
    "#e8f5e9", // Light Green
    "#fff9c4", // Light Yellow
    "#ffebee", // Light Red
    "#f3e5f5", // Light Purple
    "#e0f7fa", // Light Cyan
    "#fff3e0", // Light Orange
    "#e0f2f1", // Light Teal
  ];

  return (
    <div className="grid lg:grid-cols-4 grid-cols-2 w-full gap-5">
      {data.map((card, index) => (
        <div
          key={index}
          className="rounded-lg flex flex-col py-6 px-4 items-center cursor-pointer shadow-lg transform hover:scale-105 transition duration-300 ease-out"
          style={{ backgroundColor: colors[index % colors.length] }}
        >
          <div className="mb-3">{icons[index % icons.length]}</div>
          <h1 className="font-bold py-1 w-full text-center text-sm xl:text-lg text-gray-800 whitespace-nowrap">
            {card.title}
          </h1>
          <h1 className="font-bold lg:text-2xl text-xl text-gray-700">
            {card.value}
          </h1>
        </div>
      ))}
    </div>
  );
};

Cards.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Cards;
