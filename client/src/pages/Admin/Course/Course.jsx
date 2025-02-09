import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCourses,
  fetchCourses,
  searchCourse,
} from "../../../services/coursesSlice";
import Pagination from "../../../components/Pagination";
import { IoSearch } from "react-icons/io5";
import CourseTable from "../../../components/table/CourseTable";
import AddCourse from "./AddCourse";

const Course = () => {
  const dispatch = useDispatch();
  const allCourse = useSelector(getAllCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const dataPerPage = 10;

  useEffect(() => {
    if (searchTerm) {
      dispatch(searchCourse(searchTerm));
    } else {
      dispatch(fetchCourses());
    }
  }, [dispatch, searchTerm]);

  // Paganation
  const indexOfLastDocument = currentPage * dataPerPage;
  const indexOfFirstDocument = indexOfLastDocument - dataPerPage;
  const currentData = allCourse?.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="flex  gap-5  flex-col">
        <div className="flex flex-col md:flex-row justify-between  w-full  gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="text-nowrap w-fit p-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded-md"
          >
            Add Course
          </button>
          {showModal && (
            <AddCourse showModal={showModal} setShowModal={setShowModal} />
          )}
          <div className="flex justify-end  w-full  gap-3">
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
        </div>
      </div>

      <div className="mt-8">
        <CourseTable allSubjects={currentData} />
        <div className="flex justify-end mt-5">
          <Pagination
            dataPerPage={dataPerPage}
            totalData={allCourse?.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Course;
