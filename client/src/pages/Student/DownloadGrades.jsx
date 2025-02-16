import userProfile from "../../assets/images/user-profile.png";
import {
  fetchStudentSubjectsBySemSY,
  getStudentAllSubjects,
} from "../../services/classSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../services/authSlice";
import propTypes from "prop-types";

const DownloadGrades = ({ contentRef }) => {
  const dispatch = useDispatch();
  const studentAllSubjects = useSelector(getStudentAllSubjects);
  const userData = useSelector(getUserData);

  useEffect(() => {
    dispatch(fetchStudentSubjectsBySemSY(userData?.studentId));
  }, [dispatch, userData]);

  return (
    <div ref={contentRef} className="max-w-4xl bg-white shadow-lg rounded-lg ">
      {/* Student Profile */}
      <div className="flex items-center border-b pb-4 mb-4">
        <img
          src={userProfile}
          alt="User Profile"
          className="w-24 h-24 rounded-full border shadow-sm"
        />
        <div className="ml-6">
          <h2 className="text-xl font-semibold">
            {userData?.lastName}, {userData?.firstName}{" "}
            {userData?.middleInitial}.
          </h2>
          <p className="text-gray-700">Course: {studentAllSubjects?.course}</p>
          <p className="text-gray-700">
            Year Level: {studentAllSubjects?.yearLevel}
          </p>
          <p className="text-gray-700">
            Address: {studentAllSubjects?.address}
          </p>
        </div>
      </div>

      {/* Grades Table */}
      <div className="gap-4 grid grid-cols-2">
        {studentAllSubjects?.academicRecords?.map((record, index) => (
          <div key={index} className="mb-6 break-inside-avoid">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              School Year {record.schoolYear} ({record.semester})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full table-fixed border text-gray-800">
                <thead className="bg-gray-200 border">
                  <tr>
                    <th className="pb-4 border w-2/6 text-xs text-nowrap text-center">
                      Subject Code
                    </th>
                    <th className="pb-4 border w-3/6 text-xs">Description</th>
                    <th className="pb-4 border w-1/6 text-center text-xs">
                      Grade
                    </th>
                    <th className="pb-4 border w-1/6 text-center text-xs">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className=" text-sm">
                  {record.subjects.map((subject, idx) => (
                    <tr key={idx} className="border-b text-xs">
                      <td className="pb-4 border  break-words text-center">
                        {subject.subjectCode}
                      </td>
                      <td className="pb-4 border break-words text-center">
                        {subject.description}
                      </td>
                      <td
                        className={`pb-4 border text-center font-bold ${
                          subject.grade > 3 ? "text-red-600" : "text-gray-600"
                        }`}
                      >
                        {subject.grade !== null
                          ? parseFloat(subject.grade).toFixed(2)
                          : null}
                      </td>
                      <td
                        className={`pb-4 border text-center ${
                          subject.grade < 3.0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {subject.grade
                          ? subject.grade > 3.0
                            ? "Failed"
                            : "Passed"
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

DownloadGrades.propTypes = {
  contentRef: propTypes.object,
};

export default DownloadGrades;
