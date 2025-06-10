import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../../components/Pagination";
import { IoSearch } from "react-icons/io5";
import AddStudentClass from "./AddStudentClass";
import {
  getFilteredClasses,
  filterClasses,
} from "../../../services/classSlice";
import {
  getAllSchoolYears,
  fetchSchoolYears,
} from "../../../services/schoolYearSlice";
import ClassTable from "../../../components/table/ClassTable";
import { getAllCourses, fetchCourses } from "../../../services/coursesSlice";

const StudentClass = () => {
  const dispatch = useDispatch();
  const allCourse = useSelector(getAllCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const classes = useSelector(getFilteredClasses);
  const schoolYearList = useSelector(getAllSchoolYears);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [semester, setSemester] = useState("all");
  const [schoolYear, setSchoolYear] = useState("all");
  const [course, setCourse] = useState("all");
  const [yearLevel, setYearLevel] = useState("all");

  const dataPerPage = 10;

  useEffect(() => {
    dispatch(fetchSchoolYears());
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (semester || schoolYear || course || yearLevel) {
      dispatch(
        filterClasses({
          name: searchTerm,
          semester: semester,
          schoolYear: schoolYear,
          course: course,
          yearLevel: yearLevel,
        })
      );
    }
  }, [dispatch, semester, schoolYear, searchTerm, course, yearLevel]);

  // Paganation
  const indexOfLastDocument = currentPage * dataPerPage;
  const indexOfFirstDocument = indexOfLastDocument - dataPerPage;
  const currentData = classes?.slice(indexOfFirstDocument, indexOfLastDocument);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="flex  gap-5 lg:flex-row flex-col">
        <div className="flex flex-col  justify-between  w-full  gap-3">
          <div className="flex flex-col md:flex-row justify-between  w-full  gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="text-nowrap w-fit p-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded-md"
            >
              Add Class
            </button>
            {showModal && (
              <AddStudentClass
                setShowModal={setShowModal}
                showModal={showModal}
              />
            )}
            <div className=" flex w-full lg:w-1/2  items-center relative">
              <input
                type="text"
                placeholder="Search instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-blue-500 focus:border-blue rounded-xl w-full bg-gray-100 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              />
              <IoSearch className="text-2xl absolute right-2 text-gray-600" />
            </div>
          </div>

          <div className="flex justify-end  w-full  gap-3">
            <div className="flex gap-3  items-center flex-wrap justify-end">
              <h1 className="text-center text-gray-700">Filter by:</h1>
              <div className="">
                <div className="relative w-full ">
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="border border-blue-500 focus:border-blue rounded-xl w-fit bg-gray-100 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  >
                    <option value="all">Semester</option>
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
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
                    <option value="all">School Year</option>
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
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="border border-blue-500 focus:border-blue rounded-xl w-fit bg-gray-100 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  >
                    <option value="all">Course</option>
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
                    <option value="all">Year level</option>
                    <option value="Grade-11">Grade 11</option>
                    <option value="Grade-12">Grade 12</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ClassTable allClasses={currentData} />
        <div className="flex justify-end mt-5">
          <Pagination
            dataPerPage={dataPerPage}
            totalData={classes?.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentClass;
