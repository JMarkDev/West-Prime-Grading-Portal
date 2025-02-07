import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllStudents, fetchStudents } from "../../../services/studentSlice";
import Pagination from "../../../components/Pagination";
import { IoSearch } from "react-icons/io5";
import StudentsTable from "../../../components/table/StudentsTable";

const Students = () => {
  const dispatch = useDispatch();
  const allStudents = useSelector(getAllStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const dataPerPage = 10;

  console.log(allStudents);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

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
            <button className="text-nowrap w-fit p-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded-md">
              New Student
            </button>
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
                    // value={status || ""}
                    // onChange={(e) => setStatus(e.target.value)}
                    className="border border-blue-500 focus:border-blue rounded-xl w-fit bg-gray-100 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  >
                    <option value="">Course</option>
                    <option value="BSIT">BSIT</option>
                    <option value="BSCS">BSCS</option>
                    <option value="BSIS">BSIS</option>
                  </select>
                </div>
              </div>
              <div className="">
                <div className="relative w-full ">
                  <select
                    // value={status || ""}
                    // onChange={(e) => setStatus(e.target.value)}
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
