import userProfile from "../../assets/images/user-profile.png";
import {
  // fetchStudentSubjectsBySemSY,
  getStudentAllSubjects,
} from "../../services/classSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import propTypes from "prop-types";
import api from "../../api/axios";

const DownloadGrades = ({ contentRef }) => {
  const dispatch = useDispatch();
  const studentAllSubjects = useSelector(getStudentAllSubjects);

  const [profilePic, setProfilePic] = useState(userProfile);

  useEffect(() => {
    // dispatch(fetchStudentSubjectsBySemSY(id));

    if (studentAllSubjects.image) {
      const imageUrl = `${api.defaults.baseURL}${studentAllSubjects.image}`;

      fetch(imageUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => setProfilePic(reader.result); // Convert to Base64
          reader.readAsDataURL(blob);
        })
        .catch(() => setProfilePic(userProfile)); // Fallback to default image
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, studentAllSubjects]);
  return (
    <div
      ref={contentRef}
      className="max-w-4xl bg-white shadow-lg rounded-lg print:mx-5"
    >
      {/* Student Profile */}
      <div className="flex items-center border-b pb-4 mb-4">
        <img
          src={profilePic}
          alt="User Profile"
          className="w-24 h-24 mt-6 border shadow-sm"
        />
        <div className="ml-6 mt-4 text-sm">
          <h2 className="text-lg font-semibold">
            {studentAllSubjects?.studentName}.
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
              <table className="w-full table-fixed border text-gray-800 text-xs print:text-[10px]">
                <thead className="bg-gray-200 border">
                  <tr>
                    <th className="pb-4 border w-2/6 text-xs text-nowrap text-center">
                      Subject Code
                    </th>
                    <th className="pb-4 border w-3/6 text-xs">Description</th>
                    <th className="pb-4 border w-1/6 text-center text-xs">
                      Grade
                    </th>
                    <th className="pb-4 border w-2/6 text-center text-xs">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className=" text-sm">
                  {record.subjects.map((subject, idx) => (
                    <tr key={idx} className="border-b text-xs">
                      <td className=" border  break-words text-center">
                        {subject.subjectCode}
                      </td>
                      <td className=" border break-words text-center">
                        {subject.description}
                      </td>
                      <td
                        className={` border text-center font-bold ${
                          subject.grade > 3 ? "text-red-600" : "text-gray-600"
                        }`}
                      >
                        {subject.grade !== null && !isNaN(subject.grade)
                          ? parseFloat(subject.grade).toFixed(2)
                          : subject.grade === "INC"
                          ? "INC"
                          : ""}
                      </td>
                      <td
                        className={` border text-center ${
                          subject.grade < 3.0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {subject.grade === "INC"
                          ? "INCOMPLETE"
                          : subject.grade === "" || subject.grade === undefined
                          ? "—"
                          : !isNaN(parseFloat(subject.grade)) &&
                            isFinite(subject.grade) &&
                            parseFloat(subject.grade) >= 1.0 &&
                            parseFloat(subject.grade) <= 5.0
                          ? parseFloat(subject.grade) > 3.0
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
