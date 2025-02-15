import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllStudents,
  fetchStudents,
  filterStudents,
} from "../../../services/studentSlice";
import { getAllCourses, fetchCourses } from "../../../services/coursesSlice";

import { IoSearch } from "react-icons/io5";
import StudentsTable from "../../../components/table/StudentsTable";
import {
  getAllSchoolYears,
  fetchSchoolYears,
} from "../../../services/schoolYearSlice";

const Reports = () => {
  const dispatch = useDispatch();
  const allStudents = useSelector(getAllStudents);
  const allSchoolYears = useSelector(getAllSchoolYears);
  const allCourse = useSelector(getAllCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [course, setCourse] = useState("");
  const [schoolYear, setSchoolYear] = useState("");

  useEffect(() => {
    dispatch(fetchSchoolYears());
    dispatch(fetchCourses());
    if (searchTerm || yearLevel || course || schoolYear) {
      dispatch(
        filterStudents({ name: searchTerm, course, yearLevel, schoolYear })
      );
    } else {
      dispatch(fetchStudents());
    }
  }, [dispatch, searchTerm, yearLevel, course, schoolYear]);

  return (
    <div>
      <div className="flex  gap-5 lg:flex-row flex-col">
        <div className="flex flex-col justify-between  w-full  gap-3">
          <div className="flex flex-col md:flex-row justify-between  w-full  gap-3">
            <div className=" flex w-full   items-center relative">
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

          <div className="flex justify-between lg:flex-row flex-col  w-full  gap-3">
            <div className="flex gap-3 lg:flex-row flex-col items-start lg:items-center justify-start">
              <h1 className="text-center text-gray-700">Filter students by:</h1>
              <div className="flex gap-3 items-center">
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
                <div className="">
                  <div className="relative w-full ">
                    <select
                      value={schoolYear}
                      onChange={(e) => setSchoolYear(e.target.value)}
                      className="border border-blue-500 focus:border-blue rounded-xl w-fit bg-gray-100 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    >
                      <option value="">School Year</option>
                      {allSchoolYears.map(({ schoolYear, id }) => (
                        <option key={id} value={schoolYear}>
                          {schoolYear}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <button className=" w-fit bg-blue-600 hover:bg-blue-700 text-white p-2 px-4 l rounded-md ">
              Download Report
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <StudentsTable allStudents={allStudents} />
      </div>
    </div>
  );
};

export default Reports;
