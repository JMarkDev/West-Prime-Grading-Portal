import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import NoData from "../NoData";

const StudentsTable = ({ allStudents }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {allStudents.length === 0 ? (
          <NoData />
        ) : (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 text-nowrap">Full Name</th>
                <th className="px-4 py-3 text-nowrap">Phone</th>
                <th className="px-4 py-3 text-nowrap">Address</th>
                <th className="px-4 py-3 text-nowrap">Email</th>
                <th className="px-4 py-3 text-nowrap">Course</th>
                <th className="px-4 py-3 text-nowrap">Year Level</th>
              </tr>
            </thead>
            <tbody>
              {allStudents.map(
                ({
                  id,
                  firstName,
                  lastName,
                  middleInitial,
                  address,
                  contactNumber,
                  email,
                  studentId,
                  student: { course, yearLevel },
                }) => (
                  <tr
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/student-details/${studentId}`);
                    }}
                    key={id}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {`${firstName} ${middleInitial}. ${lastName}`}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {contactNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {address}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {course}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {yearLevel}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

StudentsTable.propTypes = {
  allStudents: PropTypes.array.isRequired,
  // fetchUpdate: PropTypes.func,
};

export default StudentsTable;
