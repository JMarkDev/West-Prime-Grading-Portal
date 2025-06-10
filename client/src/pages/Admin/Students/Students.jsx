import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllStudents,
  fetchStudents,
  filterStudents,
  filterAllStudentsAcademics,
  getAllStudentAcads,
} from "../../../services/studentSlice";
import { getAllCourses, fetchCourses } from "../../../services/coursesSlice";
import Pagination from "../../../components/Pagination";
import { IoSearch } from "react-icons/io5";
import StudentsTable from "../../../components/table/StudentsTable";
import AddStudent from "./AddStudent";
import { MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import {
  getAllSchoolYears,
  fetchSchoolYears,
} from "../../../services/schoolYearSlice";
import PrintStudents from "./PrintStudents";
import PrintAllGrades from "./PrintAll";
const Students = () => {
  const dispatch = useDispatch();
  const contentRef = useRef(null);
  const allStudents = useSelector(getAllStudents);
  const allCourse = useSelector(getAllCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [section, setSection] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const schoolYearList = useSelector(getAllSchoolYears);
  const allStudentAcads = useSelector(getAllStudentAcads);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [filteredAcads, setFilteredAcads] = useState([]);

  const dataPerPage = 10;

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchSchoolYears());
    if (searchTerm || yearLevel || course || status || section || schoolYear) {
      dispatch(
        filterStudents({
          name: searchTerm,
          course,
          yearLevel,
          status,
          section,
          schoolYear,
        })
      );

      dispatch(
        filterAllStudentsAcademics({
          name: searchTerm,
          course,
          yearLevel,
          status,
          section,
          schoolYear,
        })
      );
    } else {
      dispatch(fetchStudents());
    }
  }, [dispatch, searchTerm, yearLevel, course, status, section, schoolYear]);

  const handleReactToPrint = useReactToPrint({
    contentRef,
    documentTitle: "Grades",
    onAfterPrint: () => console.log("Printing completed"),
    onPrintError: (errorLocation, error) => {
      console.log("Error", errorLocation, error);
    },
  });

  const handlePrint = () => {
    dispatch(
      filterAllStudentsAcademics({
        name: searchTerm,
        course,
        yearLevel,
        status,
        section,
        schoolYear,
      })
    );

    setTimeout(() => {
      handleReactToPrint();
    }, 2000);
  };

  // Paganation
  const indexOfLastDocument = currentPage * dataPerPage;
  const indexOfFirstDocument = indexOfLastDocument - dataPerPage;
  const currentData = allStudents?.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (!schoolYear || !selectedSemester || !allStudentAcads.length) return;

    const filtered = allStudentAcads
      ?.map((student) => {
        const filteredRecords = student.academicRecords?.filter(
          (record) =>
            record.schoolYear === schoolYear &&
            record.semester === selectedSemester
        );

        if (filteredRecords?.length) {
          return {
            ...student,
            academicRecords: filteredRecords,
          };
        }

        return null;
      })
      .filter(Boolean); // remove nulls
    console.log(filtered);
    setFilteredAcads(filtered);
  }, [schoolYear, selectedSemester, allStudentAcads]);

  return (
    <div>
      <div className="flex  gap-5 lg:flex-row flex-col  flex-wrap">
        <div className="flex flex-col  justify-between  w-full  gap-3">
          <div className="flex flex-col md:flex-row justify-between  w-full  gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="text-nowrap w-fit p-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded-md"
            >
              Add Student
            </button>
            {showModal && (
              <AddStudent setShowModal={setShowModal} showModal={showModal} />
            )}
            <div className=" flex w-full lg:w-1/2  items-center relative">
              <input
                type="text"
                placeholder="Search student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-blue-500 focus:border-blue rounded-xl w-full bg-gray-100 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              />
              <IoSearch className="text-2xl absolute right-2 text-gray-600" />
            </div>
          </div>

          <div className="flex justify-end  w-full  gap-3">
            <div className="flex gap-3 flex-wrap items-center justify-end">
              <h1 className="text-center text-gray-700">Filter students by:</h1>
              <div className="">
                <div className="relative w-full ">
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="border border-blue-500 focus:border-blue rounded-xl w-fit bg-gray-100 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  >
                    <option value="">Course</option>
                    {allCourse.map(({ courseCode, id }) => (
                      <option key={id} value={courseCode}>
                        {courseCode}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="">
                <div className="relative w-full ">
                  <select
                    value={yearLevel}
                    onChange={(e) => setYearLevel(e.target.value)}
                    className="border border-blue-500 focus:border-blue rounded-xl w-fit bg-gray-100 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  >
                    <option value="">Year level</option>
                    <option value="Grade-11">Grade 11</option>
                    <option value="Grade-12">Grade 12</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>
              <div className="">
                <div className="relative w-full ">
                  <select
                    value={schoolYear}
                    onChange={(e) => setSchoolYear(e.target.value)}
                    className="border border-blue-500 focus:border-blue rounded-xl w-fit bg-gray-100 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  >
                    <option value="">School Year</option>
                    {schoolYearList?.map(({ id, schoolYear }) => (
                      <option key={id} value={schoolYear}>
                        {schoolYear}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="">
                <div className="relative w-full ">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border border-blue-500 focus:border-blue rounded-xl w-fit bg-gray-100 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  >
                    <option value="">Status</option>
                    <option value="Regular">Regular</option>
                    <option value="Irregular">Irregular</option>
                  </select>
                </div>
              </div>
              <div className="">
                <div className="relative w-full ">
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="border border-blue-500 focus:border-blue rounded-xl w-fit bg-gray-100 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  >
                    <option value="">Section</option>
                    <option value="Section A">Section A</option>
                    <option value="Section B">Section B</option>
                    <option value="Section C">Section C</option>
                    <option value="Section D">Section D</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="flex justify-end">
            <button
              onClick={handlePrint}
              className="p-2 px-4 flex items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
            >
              <MdLocalPrintshop className="text-xl" /> Print grades
            </button>
          </div> */}
          <div className="flex justify-end items-end flex-wrap gap-4 mb-6">
            {/* Selection Dropdowns */}
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Semester</option>
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                </select>
              </div>
            </div>

            {/* Print Button */}
            <div className="flex justify-end">
              <button
                onClick={handlePrint}
                className="p-2 px-4 flex items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-md"
              >
                <MdLocalPrintshop className="text-xl" /> Print Grades
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "none" }}>
        {/* <PrintStudents
          contentRef={contentRef}
          allStudentAcads={allStudentAcads}
        /> */}
        <PrintAllGrades students={filteredAcads} contentRef={contentRef} />
      </div>

      <div className="mt-8">
        <StudentsTable allStudents={currentData} />
        <div className="flex justify-end mt-5">
          <Pagination
            dataPerPage={dataPerPage}
            totalData={allStudents?.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Students;
