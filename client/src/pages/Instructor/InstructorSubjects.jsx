import userProfile from "../../assets/images/user-profile.png";
import {
  fetchInstructorSubjects,
  allInstructorSubjects,
} from "../../services/classSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../services/authSlice";
import { logoutUser } from "../../services/authSlice";
import { useNavigate } from "react-router-dom";

const ViewGrade = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const instructorSubjects = useSelector(allInstructorSubjects);
  const userData = useSelector(getUserData);

  useEffect(() => {
    dispatch(fetchInstructorSubjects(userData?.id));
  }, [dispatch, userData]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="max-w-6xl mt-5 mx-auto px-6 py-8 bg-white shadow-lg rounded-xl">
      {/* Student Profile Section */}
      <div className="flex relative items-center gap-6 bg-white p-6 rounded-lg shadow-md border">
        {/* Profile Image */}
        <img
          src={userProfile}
          alt="User Profile"
          className="w-28 h-28 rounded-full border border-gray-300 shadow-sm"
        />

        {/* Student Info */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {`${userData?.lastName}, ${userData?.firstName} ${userData?.middleInitial}.`}
          </h1>
          <div className="mt-2 space-y-1">
            <p className="text-gray-800 font-medium">
              <span className="text-gray-600">Address:</span>{" "}
              {userData?.address}
            </p>
            <p className="text-gray-800 font-medium">
              <span className="text-gray-600">Contact Number:</span>{" "}
              {userData?.contactNumber}
            </p>
            <p className="text-gray-800 font-medium">
              <span className="text-gray-600">Email:</span> {userData?.email}
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 rounded py-1"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Grades Table */}
      <div className="mt-6 grid lg:grid-cols-2 grid-cols-1 gap-5">
        {instructorSubjects?.academicRecords?.length > 0 ? (
          instructorSubjects?.academicRecords?.map((record, index) => (
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
                      <th className="px-3 py-2 text-left text-nowrap">
                        Subject Code
                      </th>
                      <th className="px-3 py-2 text-left">Description</th>
                      <th className="px-3 py-2 text-left">Course</th>

                      <th className="px-3 py-2">Action</th>
                      {/* <th className="px-3 py-2">Remarks</th> */}
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
                        <td className="px-3 py-2">{subject.course}</td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/input-grades`, {
                                state: {
                                  instructorId: userData.id,
                                  semester: record.semester,
                                  schoolYear: record.schoolYear,
                                  subjectCode: subject.subjectCode,
                                },
                              });
                            }}
                            className="bg-blue-600 text-nowrap hover:bg-blue-700 text-white px-3 py-1 rounded shadow-md"
                          >
                            Grade Entry
                          </button>
                        </td>

                        {/* <td
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
              </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-md border">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              No Subjects Assigned
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewGrade;
