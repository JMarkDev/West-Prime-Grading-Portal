import userProfile from "../../assets/images/user-profile.png";
import {
  fetchInstructorSubjects,
  allInstructorSubjects,
} from "../../services/classSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../services/authSlice";
import { logoutUser } from "../../services/authSlice";
import { useNavigate } from "react-router-dom";
import UpdateUserProfile from "../Shared/UpdateUserProfile";
import api from "../../api/axios";

const ViewGrade = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const instructorSubjects = useSelector(allInstructorSubjects);
  const userData = useSelector(getUserData);
  const [allSubmission, setAllSubmission] = useState([]);

  useEffect(() => {
    dispatch(fetchInstructorSubjects(userData?.id));
  }, [dispatch, userData]);

  useEffect(() => {
    const getAllSubmission = async () => {
      try {
        const response = await api.get("/submission");
        setAllSubmission(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllSubmission();
  }, []);

  console.log(instructorSubjects);

  return (
    <div className="max-w-6xl mt-5 mx-auto px-6 py-8 bg-white shadow-lg rounded-xl">
      {/* Student Profile Section */}
      <div className="flex relative items-center gap-6 bg-white p-6 rounded-lg shadow-md border">
        {/* Profile Image */}
        <UpdateUserProfile />
      </div>

      {/* Grades Table */}
      <div className="mt-6 grid lg:grid-cols-2 grid-cols-1 gap-5">
        {instructorSubjects?.academicRecords?.length > 0 ? (
          instructorSubjects?.academicRecords?.map((record, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md border"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                SY {record.schoolYear} ({record.semester})
              </h2>
              {allSubmission
                ?.filter(
                  (sub) =>
                    sub.schoolYear === record.schoolYear &&
                    sub.semester === record.semester
                )
                .map((sub) => (
                  <p
                    key={sub.id}
                    className="text-sm mb-2 text-red-700 bg-blue-100 px-4 py-2 rounded-lg inline-block"
                  >
                    📅 Deadline:{" "}
                    {new Date(sub.dateAndTime).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                ))}
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
                    {record.subjects.map((subject, index) => {
                      const hasGrade = subject.grade !== null;

                      return (
                        <tr
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
                          key={index}
                          className={`border-b hover:bg-gray-100 cursor-pointer ${
                            hasGrade
                              ? "bg-blue-100"
                              : index % 2 === 0
                              ? "bg-gray-50"
                              : "bg-white"
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
                        </tr>
                      );
                    })}
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
