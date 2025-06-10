import userProfile from "../../../assets/images/user-profile.png";
import {
  fetchStudentSubjectsBySemSY,
  getStudentAllSubjects,
  reset,
} from "../../../services/classSlice";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../api/axios";
import { MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import PrintBySem from "../../Shared/PrintBySem";
import PrintAllGrades from "../../Shared/PrintAllGrades";

const StudentDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [profilePic, setProfilePic] = useState(userProfile);
  const studentAllSubjects = useSelector(getStudentAllSubjects);
  const [filterBySem, setFilterBySem] = useState(null);
  const [printMode, setPrintMode] = useState("semester"); // 'semester' or 'all'
  const contentRef = useRef(null);

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchStudentSubjectsBySemSY(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (studentAllSubjects.image) {
      setProfilePic(`${api.defaults.baseURL}${studentAllSubjects.image}`);
    }
  }, [studentAllSubjects]);

  const handleReactToPrint = useReactToPrint({
    contentRef,
    documentTitle: "Grades",
    onAfterPrint: () => console.log("Printing completed"),
    onPrintError: (errorLocation, error) => {
      console.log("Error", errorLocation, error);
    },
  });

  const handlePrint = () => {
    dispatch(fetchStudentSubjectsBySemSY(id));
    setPrintMode("all");

    setTimeout(() => {
      handleReactToPrint();
    }, 500);
  };

  const handlePrintBySem = (schoolYear, semester) => {
    const filtered = studentAllSubjects.academicRecords.filter((acad) => {
      return acad.schoolYear === schoolYear && acad.semester === semester;
    });
    const studentData = {
      studentName: studentAllSubjects.studentName,
      studentId: studentAllSubjects.studentId,
      course: studentAllSubjects.course,
      yearLevel: studentAllSubjects.yearLevel,
      academicRecords: filtered,
    };
    setFilterBySem(studentData);
    setPrintMode("semester");

    setTimeout(() => {
      handleReactToPrint();
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl ">
      {/* Student Profile Section */}
      <div className="flex gap-6 bg-white p-6 rounded-lg shadow-md border">
        {/* Profile Image */}
        <img
          src={profilePic}
          alt="User Profile"
          className="w-28 h-28 rounded-full border border-gray-300 shadow-sm"
        />

        {/* Student Info */}
        <div className="uppercase">
          <h1 className="text-lg uppercase text-gray-900 ">
            STUDENT ID:{" "}
            <span className="font-semibold">
              {studentAllSubjects?.studentId}
            </span>
          </h1>
          <h1 className="  text-gray-900 ">
            STUDENT NAME:{" "}
            <span className="font-semibold">
              {studentAllSubjects?.studentName}
            </span>
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
            <p className="text-gray-800 font-medium">
              <span className="text-gray-600">STATUS:</span>{" "}
              {studentAllSubjects?.status}
            </p>
            <p className="text-gray-800 font-medium">
              <span className="text-gray-600">SECTION:</span>{" "}
              {studentAllSubjects?.section}
            </p>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      {studentAllSubjects?.academicRecords?.length > 0 && (
        <div className="flex my-4 justify-end ml-auto h-fit items-start">
          <button
            onClick={() => handlePrint()}
            className="p-2 px-4 text-sm flex items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
          >
            <MdLocalPrintshop className="text-xl" /> Print all grades
          </button>
        </div>
      )}

      {/* Hidden Print Components */}
      <div style={{ display: "none" }}>
        {printMode === "semester" ? (
          <PrintBySem filterBySem={filterBySem} contentRef={contentRef} />
        ) : (
          <PrintAllGrades
            studentData={studentAllSubjects}
            contentRef={contentRef}
          />
        )}
      </div>

      <div className="mt-6 grid lg:grid-cols-2 grid-cols-1 gap-5">
        {studentAllSubjects?.academicRecords?.length > 0 ? (
          studentAllSubjects?.academicRecords?.map((record, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md border"
            >
              <div className="flex justify-between items-center gap-2 mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  SY {record.schoolYear} ({record.semester})
                </h2>
                <button
                  onClick={() =>
                    handlePrintBySem(record.schoolYear, record.semester)
                  }
                  className="p-2 text-sm flex items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <MdLocalPrintshop className="text-lg" /> Print grades
                </button>
              </div>

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
                          {subject.grade !== null && !isNaN(subject.grade)
                            ? parseFloat(subject.grade).toFixed(2)
                            : subject.grade === "INC"
                            ? "INC"
                            : ""}
                        </td>
                        <td
                          className={`px-3 py-2 font-medium text-center ${
                            subject.grade < 3.0
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
