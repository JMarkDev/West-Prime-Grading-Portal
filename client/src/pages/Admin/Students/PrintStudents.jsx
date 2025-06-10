import userProfile from "../../../assets/images/user-profile.png";
import propTypes from "prop-types";
import { useEffect, useState } from "react";
import api from "../../../api/axios";

const PrintStudents = ({ contentRef, allStudentAcads }) => {
  const [profilePics, setProfilePics] = useState({});

  useEffect(() => {
    allStudentAcads?.forEach((student) => {
      if (student.image) {
        const imageUrl = `${api.defaults.baseURL}${student.image}`;
        fetch(imageUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              setProfilePics((prev) => ({
                ...prev,
                [student.id]: reader.result,
              }));
            };
            reader.readAsDataURL(blob);
          })
          .catch(() =>
            setProfilePics((prev) => ({
              ...prev,
              [student.id]: userProfile,
            }))
          );
      } else {
        setProfilePics((prev) => ({
          ...prev,
          [student.id]: userProfile,
        }));
      }
    });
  }, [allStudentAcads]);

  return (
    <div ref={contentRef} className="print:mx-5">
      {allStudentAcads?.map((student, index) => (
        <div
          key={index}
          className="max-w-4xl bg-white shadow-lg rounded-lg mb-12 page-break"
        >
          {/* Student Profile */}
          <div className="flex items-center border-b pb-4 mb-4">
            <img
              src={profilePics[student.id] || userProfile}
              alt="User Profile"
              className="w-24 h-24 mt-6 border shadow-sm"
            />
            <div className="ml-6 mt-4 text-sm ">
              <h2 className="text-lg font-semibold">{student.studentName}</h2>
              <p className="text-gray-700">Course: {student.course}</p>
              <p className="text-gray-700">Year Level: {student.yearLevel}</p>
              <p className="text-gray-700">Address: {student.address}</p>
            </div>
          </div>

          {/* Grades Table */}
          <div className="gap-4 grid grid-cols-2">
            {student.academicRecords?.map((record, idx) => (
              <div key={idx} className="mb-6 break-inside-avoid">
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
                        <th className="pb-4 border w-3/6 text-xs">
                          Description
                        </th>
                        <th className="pb-4 border w-1/6 text-center text-xs">
                          Grade
                        </th>
                        <th className="pb-4 border w-2/6 text-center text-xs">
                          Remarks
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {record.subjects.map((subject, subjectIdx) => (
                        <tr key={subjectIdx} className="border-b text-xs">
                          <td className=" border text-center">
                            {subject.subjectCode}
                          </td>
                          <td className=" border text-center">
                            {subject.description}
                          </td>
                          <td
                            className={` border text-center font-bold ${
                              subject.grade > 3
                                ? "text-red-600"
                                : "text-gray-600"
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
                              subject.grade <= 3
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {subject.grade === "INC"
                              ? "INCOMPLETE"
                              : subject.grade === "" ||
                                subject.grade === undefined
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
      ))}
    </div>
  );
};

PrintStudents.propTypes = {
  contentRef: propTypes.object,
  allStudentAcads: propTypes.array.isRequired,
};

export default PrintStudents;
