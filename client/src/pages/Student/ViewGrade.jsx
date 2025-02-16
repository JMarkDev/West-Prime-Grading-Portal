import userProfile from "../../assets/images/user-profile.png";
import {
  fetchStudentSubjectsBySemSY,
  getStudentAllSubjects,
} from "../../services/classSlice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../services/authSlice";
import { logoutUser } from "../../services/authSlice";
import html2pdf from "html2pdf.js";
import { FaDownload } from "react-icons/fa";
import DownloadGrades from "./DownloadGrades";

const ViewGrade = () => {
  const dispatch = useDispatch();
  const studentAllSubjects = useSelector(getStudentAllSubjects);
  const userData = useSelector(getUserData);
  const contentRef = useRef();

  useEffect(() => {
    dispatch(fetchStudentSubjectsBySemSY(userData?.studentId));
  }, [dispatch, userData]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleDownloadPDF = () => {
    const element = contentRef.current;

    const options = {
      margin: 0.3,
      filename: "Grades.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    // Convert HTML content into PDF
    html2pdf().set(options).from(element).save();
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
        <div className="absolute top-0 right-0">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 rounded py-1"
          >
            Logout
          </button>
        </div>
      </div>
      {/* Download Grades Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition duration-200"
        >
          <FaDownload />
          Download Grades
        </button>
      </div>
      <div className="hidden ">
        <DownloadGrades contentRef={contentRef} />
      </div>

      {/* Grades Table */}
      <div className="mt-6 grid lg:grid-cols-2 grid-cols-1 gap-5">
        {studentAllSubjects?.academicRecords?.map((record, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md border">
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
                    <th className="px-3 py-2 text-left text-nowrap">
                      Description
                    </th>
                    <th className="px-3 py-2 text-nowrap">Grade</th>
                    <th className="px-3 py-2 text-nowrap">Remarks</th>
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
        ))}
      </div>
    </div>
  );
};

export default ViewGrade;
