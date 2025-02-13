import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getClassByInstructorSemSySubjectCode,
  getClassByInstructor,
} from "../../../services/classSlice";

const ViewClass = () => {
  const location = useLocation();
  const { instructorId, semester, schoolYear, subjectCode } =
    location.state || {}; // Fallback in case state is undefined

  const dispatch = useDispatch();
  const classDetails = useSelector(getClassByInstructor);

  useEffect(() => {
    dispatch(
      getClassByInstructorSemSySubjectCode({
        instructorId: instructorId,
        semester: semester,
        schoolYear: schoolYear,
        subjectCode: subjectCode,
      })
    );
  }, [dispatch, instructorId, semester, schoolYear, subjectCode]);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {classDetails?.subjectCode} - {classDetails?.description}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {classDetails?.semester}, {classDetails?.schoolYear}
        </p>
      </div>

      {/* Instructor Card */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
          Instructor
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {classDetails?.instructor}
        </p>
      </div>

      {/* Student List */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
          Enrolled Students ({classDetails?.students?.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border rounded-lg overflow-hidden">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="text-left p-3 text-gray-700 dark:text-white">
                  #
                </th>
                <th className="text-left p-3 text-gray-700 dark:text-white">
                  Student Name
                </th>
              </tr>
            </thead>
            <tbody>
              {classDetails?.students?.map((student, index) => (
                <tr
                  key={student.id}
                  className="border-t border-gray-300 dark:border-gray-700"
                >
                  <td className="p-3 text-gray-600 dark:text-gray-300">
                    {index + 1}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">
                    {student.fullName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewClass;
