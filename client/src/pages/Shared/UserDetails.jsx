import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearUser,
  fetchUserById,
  getFetchedUserById,
} from "../../services/usersSlice";
import {
  fetchInstructorSubjects,
  allInstructorSubjects,
} from "../../services/classSlice";
import { useEffect, useState } from "react";
import axios from "../../api/axios";

const UserProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(getFetchedUserById);
  const instructorSubjects = useSelector(allInstructorSubjects);

  const [profilePic, setProfilePic] = useState(
    "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
  );
  const [data, setData] = useState({
    image: "",
    firstName: "",
    middleInitial: "",
    lastName: "",
    email: "",
    role: "",
    contactNumber: "",
    address: "",
  });

  useEffect(() => {
    dispatch(fetchUserById(id));
    dispatch(fetchInstructorSubjects(id)); // Fetch instructor's subjects
  }, [id, dispatch]);

  useEffect(() => {
    if (user) {
      setData(user);
      dispatch(clearUser());
    }
  }, [user, id, dispatch]);

  useEffect(() => {
    if (data.image) {
      setProfilePic(`${axios.defaults.baseURL}${data.image}`);
    }
  }, [data]);

  console.log(instructorSubjects);

  return (
    <>
      <div className="flex text-sm flex-col lg:flex-row w-full gap-5">
        <div className="flex flex-col gap-3 justify-center items-center p-4 bg-white border border-gray-300 shadow-lg min-w-[250px] h-fit rounded-lg">
          <img
            className="w-32 h-32 rounded-full"
            src={profilePic}
            alt="Profile"
          />
          <h1 className="font-bold text-lg text-gray-800 text-center">{`${data.firstName} ${data.middleInitial}. ${data.lastName}`}</h1>
          <span className="text-gray-700 md:text-md text-sm">
            {data?.email}
          </span>
        </div>

        <div className="flex flex-col flex-grow md:border md:border-gray-300 md:shadow-lg rounded-lg">
          <div className="py-6 md:px-4 text-gray-600">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-5">
                <label className="text-md font-semibold text-gray-700 w-1/4">
                  First name
                </label>
                <input
                  className="rounded-lg border-2 bg-gray-200 border-gray-200 flex-grow p-2 text-sm"
                  type="text"
                  disabled
                  value={data?.firstName || ""}
                />
              </div>
              <div className="flex items-center gap-5">
                <label className="text-md font-semibold text-gray-700 w-1/4">
                  Last name
                </label>
                <input
                  className="rounded-lg border-2 bg-gray-200 border-gray-200 flex-grow p-2 text-sm"
                  type="text"
                  disabled
                  value={data?.lastName || ""}
                />
              </div>
              <div className="flex items-center gap-5">
                <label className="text-md font-semibold text-gray-700 w-1/4">
                  Email
                </label>
                <input
                  className="rounded-lg border-2 bg-gray-200 border-gray-200 flex-grow p-2 text-sm"
                  type="text"
                  disabled
                  value={data?.email || ""}
                />
              </div>
              <div className="flex items-center gap-5">
                <label className="text-md font-semibold text-gray-700 w-1/4">
                  Contact Number
                </label>
                <input
                  className="rounded-lg border-2 bg-gray-200 border-gray-200 flex-grow p-2 text-sm"
                  type="text"
                  disabled
                  value={data?.contactNumber || ""}
                />
              </div>
              <div className="flex items-center gap-5">
                <label className="text-md font-semibold text-gray-700 w-1/4">
                  Address
                </label>
                <input
                  className="rounded-lg border-2 bg-gray-200 border-gray-200 flex-grow p-2 text-sm"
                  type="text"
                  disabled
                  value={data?.address || ""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructor Subjects Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-900">Assigned Subjects</h2>
        <div className="mt-4 grid lg:grid-cols-2 grid-cols-1 gap-5">
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
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-3 py-2 text-left">Subject Code</th>
                        <th className="px-3 py-2 text-left">Description</th>
                        <th className="px-3 py-2 text-left">Course</th>
                      </tr>
                    </thead>
                    <tbody>
                      {record.subjects.map((subject, idx) => {
                        const hasGrade = subject.grade !== null;
                        return (
                          <tr
                            key={idx}
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
    </>
  );
};

export default UserProfile;
