import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getClassByInstructorSemSySubjectCode,
  getClassByInstructor,
} from "../../services/classSlice";
import Back from "../../components/buttons/Back";
import api from "../../api/axios";
import { useToast } from "../../hooks/useToast";
import { MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import PrintGrades from "./PrintGrades";

const InputGrades = () => {
  const location = useLocation();
  const toast = useToast();
  const { instructorId, semester, schoolYear, subjectCode } =
    location.state || {};

  const dispatch = useDispatch();
  const classDetails = useSelector(getClassByInstructor);
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState({});
  const contentRef = useRef(null);
  const [allSubmission, setAllSubmission] = useState([]);
  const [deadlinePassed, setDeadlinePassed] = useState(false);

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

  useEffect(() => {
    // Check deadline when both allSubmission and classDetails are available
    if (allSubmission.length > 0 && classDetails) {
      // Find the matching submission deadline
      const matchingSubmission = allSubmission.find(
        (sub) => sub.schoolYear === schoolYear && sub.semester === semester
      );

      // Check if the deadline has passed
      const isDeadlinePassed =
        matchingSubmission &&
        new Date(matchingSubmission.dateAndTime) < new Date();

      setDeadlinePassed(isDeadlinePassed);
    }
  }, [allSubmission, classDetails, schoolYear, semester]);

  const handleGradeChange = (studentId, value) => {
    const upperValue = value.toUpperCase();

    // Always store what user types, even partial inputs like '1.'
    setGrades((prev) => ({
      ...prev,
      [studentId]: upperValue,
    }));

    // Allow typing 'INC' progressively
    if ("INC".startsWith(upperValue)) return;

    // Allow decimals during typing (e.g., '1.', '1.5')
    const validNumberPattern = /^\d{0,1}(\.\d{0,2})?$/;
    if (validNumberPattern.test(upperValue)) {
      const parsed = parseFloat(upperValue);
      if (!isNaN(parsed) && parsed >= 1.0 && parsed <= 5.0) {
        // Optionally reformat later (e.g., onBlur)
      }
      return;
    }

    // If it's invalid input (like '15', '1A', etc.), don't update state further
  };

  const handleSaveGrades = async () => {
    if (deadlinePassed) {
      toast.error("Grade submission deadline has passed!");
      return;
    }

    const updatedGrades = Object.entries(grades).map(([id, grade]) => ({
      id: parseInt(id),
      grade,
    }));
    setLoading(true);

    try {
      const response = await api.put("/classes/input-grades", {
        grades: updatedGrades,
      });
      if (response.data.status === "success") {
        toast.success("Grades saved successfully!");
        setLoading(false);
        dispatch(
          getClassByInstructorSemSySubjectCode({
            instructorId,
            semester,
            schoolYear,
            subjectCode,
          })
        );
      }
    } catch (error) {
      setLoading(false);
      console.error("Error saving grades:", error);
      alert("Failed to save grades. Please try again.");
    }
  };

  const handleReactToPrint = useReactToPrint({
    contentRef,
    documentTitle: "Grades",
    onAfterPrint: () => console.log("Printing completed"),
    onPrintError: (errorLocation, error) => {
      console.log("Error", errorLocation, error);
    },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto mt-5 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
      <Back />

      {/* Class Information Section */}
      <div className="bg-blue-100 mt-5 dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {classDetails?.subjectCode} - {classDetails?.description}
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          {classDetails?.semester}, {classDetails?.schoolYear} |{" "}
          {classDetails?.course}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Instructor:{" "}
          <span className="font-semibold">{classDetails?.instructor}</span>
        </p>
        {/* {deadlinePassed && (
          <div className="mt-2 text-red-600 font-semibold bg-red-100 dark:bg-red-900/30 dark:text-red-400 p-2 rounded">
            Grade submission deadline has passed!
          </div>
        )} */}
      </div>

      {/* Student Grades Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
            Enrolled Students ({classDetails?.students?.length})
          </h2>
          <button
            onClick={handleReactToPrint}
            className="p-2 mb-4 px-4 flex items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
          >
            <MdLocalPrintshop className="text-xl" /> Print
          </button>
        </div>

        {/* Table of Students */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border rounded-lg overflow-hidden">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="text-left p-3 text-gray-700 dark:text-white">
                  #
                </th>
                <th className="text-left p-3 text-gray-700 dark:text-white">
                  Student Name
                </th>
                <th className="text-left p-3 text-gray-700 dark:text-white">
                  Grade
                </th>
                <th className="text-left p-3 text-gray-700 dark:text-white">
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
                    <td className="p-3 text-gray-600 dark:text-gray-300">
                      {index + 1}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-300">
                      {student.fullName}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-300">
                      <input
                        type="text"
                        inputMode="decimal"
                        className="w-20 p-2 border border-gray-300 rounded text-center"
                        value={
                          grades[student.id] !== undefined
                            ? grades[student.id]
                            : student.grade || ""
                        }
                        onChange={(e) =>
                          handleGradeChange(student.id, e.target.value)
                        }
                        disabled={deadlinePassed}
                      />
                    </td>
                    <td
                      className={`px-3 py-2 font-medium text-center ${
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
      </div>

      <div style={{ display: "none" }}>
        <PrintGrades contentRef={contentRef} />
      </div>

      {/* Save Grades Button */}
      <button
        disabled={loading || deadlinePassed}
        onClick={handleSaveGrades}
        type="button"
        className={`mt-4 ${
          deadlinePassed
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white font-semibold py-2 px-6 rounded-lg`}
      >
        {loading ? (
          <>
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 me-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            Loading...
          </>
        ) : deadlinePassed ? (
          "Deadline Passed"
        ) : (
          "Save Grades"
        )}
      </button>
    </div>
  );
};

export default InputGrades;
