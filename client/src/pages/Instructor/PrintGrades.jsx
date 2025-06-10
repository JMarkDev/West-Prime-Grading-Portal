/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getClassByInstructorSemSySubjectCode,
  getClassByInstructor,
} from "../../services/classSlice";
import westprimeLogo from "../../assets/images/west_prime_logo-removebg-preview.png";
import { getUserData } from "../../services/authSlice";

const InputGrades = ({ contentRef }) => {
  const location = useLocation();
  const userData = useSelector(getUserData);

  const { instructorId, semester, schoolYear, subjectCode } =
    location.state || {};

  const dispatch = useDispatch();
  const classDetails = useSelector(getClassByInstructor);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    dispatch(
      getClassByInstructorSemSySubjectCode({
        instructorId,
        semester,
        schoolYear,
        subjectCode,
      })
    );
  }, [dispatch, instructorId, semester, schoolYear, subjectCode]);

  return (
    <div
      ref={contentRef}
      className="p-4 max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg"
    >
      {/* Compact Header with reduced padding */}
      <div className="flex items-center gap-2 mb-2">
        <img src={westprimeLogo} alt="West Prime Logo" className="w-16" />
        <div className="text-center flex-1">
          <h1 className="font-bold text-base">
            West Prime Horizon Institute, Inc.
          </h1>
          <p className="text-xs">West Prime Horizon Institute Building</p>
          <p className="text-xs">
            V. Sagun cor. M. Roxas St., San Francisco Dist. Pagadian City
          </p>
          <p className="text-xs">
            Cell No.: 0920-798-3228 (Smart) | Email:{" "}
            <span className="text-gray-500">wephi0217@gmail.com</span>
          </p>
        </div>
      </div>

      {/* Class Information - More compact with less padding */}
      <div className="bg-blue-100 text-sm dark:bg-gray-800 p-2 rounded-lg mb-2">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          {classDetails?.subjectCode} - {classDetails?.description}
        </h2>
        <div className="flex flex-row justify-between text-xs">
          <p className="text-gray-700 dark:text-gray-300">
            {classDetails?.semester}, {classDetails?.schoolYear} |{" "}
            {classDetails?.course}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Instructor:{" "}
            <span className="font-semibold">{classDetails?.instructor}</span>
          </p>
        </div>
      </div>

      {/* Student Grades Table - Optimized for space */}
      <div className="overflow-x-auto shadow-lg rounded-lg mb-3 text-xs">
        <table className="min-w-full bg-white dark:bg-gray-800 border rounded-lg overflow-hidden">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="text-left py-1 px-2 text-gray-700 dark:text-white">
                #
              </th>
              <th className="text-left py-1 px-2 text-gray-700 dark:text-white">
                Student Name
              </th>
              <th className="text-left py-1 px-2 text-gray-700 dark:text-white">
                Grade
              </th>
              <th className="text-left py-1 px-2 text-gray-700 dark:text-white">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {classDetails?.students?.map((student, index) => {
              const grade = grades[student.id] ?? student.grade ?? "";
              const isFailed = grade > 3.0 || grade === "INC";

              return (
                <tr
                  key={student.id}
                  className={`border-t border-gray-300 dark:border-gray-700 ${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "bg-white dark:bg-gray-900"
                  }`}
                >
                  <td className="px-2 py-1 text-gray-600 dark:text-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-2 py-1 text-gray-600 dark:text-gray-300">
                    {student.fullName}
                  </td>
                  <td className="px-2 py-1 text-gray-600 dark:text-gray-300">
                    {grades[student.id] !== undefined
                      ? grades[student.id]
                      : student.grade || "-"}
                  </td>
                  <td
                    className={`px-2 py-1 font-medium text-center ${
                      isFailed ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {grade === "INC"
                      ? "INCOMPLETE"
                      : grade === "" || grade === undefined
                      ? "—"
                      : !isNaN(parseFloat(grade)) &&
                        isFinite(grade) &&
                        parseFloat(grade) >= 1.0 &&
                        parseFloat(grade) <= 5.0
                      ? parseFloat(grade) > 3.0
                        ? "Failed"
                        : "Passed"
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Signature Section - Reduced spacing */}
      <div className="mt-3">
        <p className="font-bold text-sm">{`${userData.firstName} ${userData?.middleInitial}. ${userData.lastName}`}</p>
        <p className="text-sm">School Faculty</p>
      </div>
    </div>
  );
};

export default InputGrades;
