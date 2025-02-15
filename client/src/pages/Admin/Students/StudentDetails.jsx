import userProfile from "../../../assets/images/user-profile.png";
import {
  fetchStudentSubjectsBySemSY,
  getStudentAllSubjects,
} from "../../../services/classSlice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const StudentDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const studentAllSubjects = useSelector(getStudentAllSubjects);
  useEffect(() => {
    dispatch(fetchStudentSubjectsBySemSY(id));
  }, [dispatch, id]);

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl">
      {/* Student Profile Section */}
      <div className="flex items-center gap-6 bg-white p-6 rounded-lg shadow-md border">
        {/* Profile Image */}
        <img
          src={userProfile}
          alt="User Profile"
          className="w-28 h-28 rounded-full border border-gray-300 shadow-sm"
        />

        {/* Student Info */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {`${studentAllSubjects?.studentName}`}
          </h1>
          <div className="mt-2 space-y-1">
            <p className="text-gray-800 font-medium">
              <span className="text-gray-600">Address:</span>{" "}
              {studentAllSubjects?.address}
            </p>
            <p className="text-gray-800 font-medium">
              <span className="text-gray-600">Course:</span>{" "}
              {studentAllSubjects?.course}
            </p>
            <p className="text-gray-800 font-medium">
              <span className="text-gray-600">Year Level:</span>{" "}
              {studentAllSubjects?.yearLevel}
            </p>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="mt-6 grid lg:grid-cols-2 grid-cols-1 gap-5">
        {studentAllSubjects?.academicRecords?.length > 0 ? (
          studentAllSubjects?.academicRecords?.map((record, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md border"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                SY {record.schoolYear} ({record.semester})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-800 border-collapse rounded-lg shadow-sm">
                  {/* Table Header */}
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-3 py-2 text-left">Subject Code</th>
                      <th className="px-3 py-2 text-left">Description</th>
                      <th className="px-3 py-2">Grade</th>
                      <th className="px-3 py-2">Remarks</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {record.subjects.map((subject, index) => (
                      <tr
                        key={index}
                        className={`border-b hover:bg-gray-100 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="px-3 py-2">{subject.subjectCode}</td>
                        <td className="px-3 py-2">{subject.description}</td>
                        <td
                          className={`px-3 py-2 font-bold ${
                            subject.grade > 3 ? "text-red-600" : "text-gray-600"
                          } text-center`}
                        >
                          {subject.grade !== null
                            ? parseFloat(subject.grade).toFixed(2)
                            : null}
                        </td>
                        <td
                          className={`px-3 py-2 font-medium text-center ${
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
          ))
        ) : (
          <h2 className="text-2xl font-semibold text-gray-800 p-4">
            No Subjects Enrolled
          </h2>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;
