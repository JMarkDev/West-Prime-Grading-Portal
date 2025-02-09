import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllStudents,
  fetchStudents,
  filterStudents,
} from "../../../services/studentSlice";
import { getAllCourses, fetchCourses } from "../../../services/coursesSlice";
import Pagination from "../../../components/Pagination";
import { IoSearch } from "react-icons/io5";
import StudentsTable from "../../../components/table/StudentsTable";
import AddStudent from "./AddStudent";

const Students = () => {
  const dispatch = useDispatch();
  const allStudents = useSelector(getAllStudents);
  const allCourse = useSelector(getAllCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [course, setCourse] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const dataPerPage = 10;

  useEffect(() => {
    dispatch(fetchCourses());
    if (searchTerm || yearLevel || course) {
      dispatch(filterStudents({ name: searchTerm, course, yearLevel }));
    } else {
      dispatch(fetchStudents());
    }
  }, [dispatch, searchTerm, yearLevel, course]);

  // Paganation
  const indexOfLastDocument = currentPage * dataPerPage;
  const indexOfFirstDocument = indexOfLastDocument - dataPerPage;
  const currentData = allStudents?.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );

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
            <div className="flex gap-3 items-center justify-end">
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
