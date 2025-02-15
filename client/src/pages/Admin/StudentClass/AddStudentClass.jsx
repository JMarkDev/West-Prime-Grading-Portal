import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, getAllCourses } from "../../../services/coursesSlice";
import { fetchUsers, getAllUsers } from "../../../services/usersSlice";
import { fetchStudents, getAllStudents } from "../../../services/studentSlice";
import {
  getAllSchoolYears,
  fetchSchoolYears,
} from "../../../services/schoolYearSlice";
import rolesList from "../../../constants/rolesList";
import { getAllSubjects, fetchSubjects } from "../../../services/subjectSlice";
import LoginLoading from "../../../components/loader/loginloader/LoginLoading";
import api from "../../../api/axios";
import { useToast } from "../../../hooks/useToast";
import { filterClasses } from "../../../services/classSlice";

const AddClassForm = ({ showModal, setShowModal }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const subjects = useSelector(getAllSubjects);
  const instructors = useSelector(getAllUsers);
  const students = useSelector(getAllStudents);
  const allCourse = useSelector(getAllCourses);
  const [filterStudents, setFilterStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const schoolYears = useSelector(getAllSchoolYears);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    schoolYear: "",
    semester: "",
    subjects: [],
    instructor: "",
    instructorId: "",
    students: [],
    yearLevel: selectedCourse,
    course: yearLevel,
  });

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchUsers(rolesList.instructor));
    dispatch(fetchStudents());
    dispatch(fetchSchoolYears());
    dispatch(fetchSubjects());
  }, [dispatch]);

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      yearLevel: yearLevel,
      course: selectedCourse,
    }));
  }, [selectedCourse, yearLevel]);

  const onSubmit = async () => {
    setLoading(true);
    if (data.subjects.length === 0) {
      toast.error("Please select at least one subject");
      setLoading(false);
      return;
    }

    if (data.students.length === 0) {
      setLoading(false);
      toast.error("Please select at least one student");
      return;
    }
    try {
      const response = await api.post("/classes/add", data);
      if (response.data.status === 201) {
        toast.success(response.data.message);
        dispatch(
          filterClasses({
            name: "",
            semester: "all",
            schoolYear: "all",
          })
        );

        setTimeout(() => {
          setShowModal(false);
        }, 1000);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  useEffect(() => {
    let filtered = students;

    // Filter by selected course and year level
    if (selectedCourse) {
      filtered = filtered.filter(
        (student) => student.student.course === selectedCourse
      );
    }
    if (yearLevel) {
      filtered = filtered.filter(
        (student) => student.student.yearLevel === yearLevel
      );
    }

    // Filter by search term (first name or last name)
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilterStudents(filtered);
  }, [selectedCourse, students, yearLevel, searchTerm]);

  return (
    <>
      <div
        id="default-modal"
        tabIndex="-1"
        aria-hidden={!showModal}
        className="fixed overflow-y-auto overflow-hidden  inset-0 z-50 px-4 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-40 font-normal"
      >
        {loading && <LoginLoading />}
        <div className="w-full mx-5 max-w-3xl bg-white rounded-lg shadow-lg p-6 h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Add New Class</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium">School Year</label>
                <select
                  {...register("schoolYear")}
                  type="text"
                  onChange={(e) =>
                    setData({ ...data, schoolYear: e.target.value })
                  }
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="e.g. 2024-2025"
                >
                  <option value="">Select School Year</option>
                  {schoolYears.map((schoolYear) => (
                    <option key={schoolYear.id} value={schoolYear.schoolYear}>
                      {schoolYear.schoolYear}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium">Semester</label>
                <select
                  {...register("semester")}
                  onChange={(e) =>
                    setData({ ...data, semester: e.target.value })
                  }
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Semester</option>
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Instructor</label>
              {/* <select
                  {...register("instructor")}
                  onChange={(e) =>
                    setData({
                      ...data,
                      instructor: e.target.value,
                      instructorId: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded border-gray-300"
                >
                  <option value="">Select Instructor</option>
                  {instructors.map(
                    ({ id, firstName, lastName, middleInitial }) => (
                      <option
                        key={id}
                        value={`${firstName} ${middleInitial}. ${lastName} `}
                      >
                        {`${firstName} ${middleInitial}. ${lastName}`}
                      </option>
                    )
                  )}
                </select> */}
              <select
                {...register("instructor")}
                onChange={(e) => {
                  const selectedInstructor = instructors.find(
                    (inst) => inst.id.toString() === e.target.value
                  );

                  setData({
                    ...data,
                    instructor: selectedInstructor
                      ? `${selectedInstructor.firstName} ${selectedInstructor.middleInitial}. ${selectedInstructor.lastName}`
                      : "",
                    instructorId: e.target.value, // Store only the ID
                  });
                }}
                required
                className="w-full p-2 border rounded border-gray-300"
              >
                <option value="">Select Instructor</option>
                {instructors.map(
                  ({ id, firstName, lastName, middleInitial }) => (
                    <option key={id} value={id}>
                      {`${firstName} ${middleInitial}. ${lastName}`}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Subjects</label>
              <div className="border rounded-lg shadow-sm bg-white p-3 max-h-52 overflow-y-auto">
                <ul className="space-y-2">
                  {subjects.map((subject) => (
                    <li
                      key={subject.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        id={`subject-${subject.id}`}
                        checked={data.subjects.some((s) => s.id === subject.id)}
                        onChange={(e) => {
                          setData((prevData) => {
                            let updatedSubjects;
                            if (e.target.checked) {
                              // Add subject (store full object)
                              updatedSubjects = [
                                ...prevData.subjects,
                                {
                                  id: Number(subject.id),
                                  subjectCode: subject.subjectCode,
                                  description: subject.description,
                                },
                              ];
                            } else {
                              // Remove subject by filtering out its id
                              updatedSubjects = prevData.subjects.filter(
                                (s) => s.id !== subject.id
                              );
                            }

                            return { ...prevData, subjects: updatedSubjects };
                          });
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />

                      <label
                        htmlFor={`subject-${subject.id}`}
                        className="text-gray-700 text-sm w-full"
                      >
                        {`${subject.subjectCode} (${subject.description})`}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <label className="text-sm font-semibold text-gray-700">
                  Students
                </label>
                <div className="flex justify-end flex-wrap gap-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search student"
                      className="border border-gray-300 bg-white text-gray-700 rounded-lg pl-10 pr-3 py-2 w-60 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-500">
                      <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                    </div>
                  </div>
                  {/* Course Filter */}
                  <select
                    value={selectedCourse}
                    required
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="border  border-gray-300 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Course</option>
                    {allCourse.map(({ courseCode, id }) => (
                      <option key={id} value={courseCode}>
                        {courseCode}
                      </option>
                    ))}
                  </select>
                  <select
                    value={yearLevel}
                    required
                    onChange={(e) => setYearLevel(e.target.value)}
                    className="border  border-gray-300 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Year Level</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              {/* Student List */}
              <div className="border rounded-lg shadow-sm bg-white p-3 max-h-52 overflow-y-auto">
                <div className="flex items-center gap-3 p-2 bg-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="select-all-students"
                    checked={
                      data.students.length === filterStudents.length &&
                      filterStudents.length > 0
                    }
                    onChange={(e) => {
                      setData({
                        ...data,
                        students: e.target.checked
                          ? filterStudents.map((student) => ({
                              id: student.student.id,
                              fullName: `${student.firstName} ${
                                student.middleInitial
                                  ? student.middleInitial + "."
                                  : ""
                              } ${student.lastName}`,
                            }))
                          : [],
                      });
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="select-all-students"
                    className="text-gray-700 text-sm w-full"
                  >
                    Select All Students
                  </label>
                </div>

                <ul className="space-y-2">
                  {filterStudents.map(
                    ({ student, firstName, middleInitial, lastName }) => (
                      <li
                        key={student.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          id={`student-${student.id}`}
                          checked={data.students.some(
                            (s) => s.id === student.id
                          )}
                          onChange={(e) => {
                            let updatedStudents = [...data.students];
                            if (e.target.checked) {
                              updatedStudents.push({
                                id: student.id,
                                fullName: `${firstName} ${
                                  middleInitial ? middleInitial + "." : ""
                                } ${lastName}`,
                              });
                            } else {
                              updatedStudents = updatedStudents.filter(
                                (s) => s.id !== student.id
                              );
                            }
                            setData({ ...data, students: updatedStudents });
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`student-${student.id}`}
                          className="text-gray-700 text-sm w-full"
                        >
                          {`${firstName} ${
                            middleInitial ? middleInitial + "." : ""
                          } ${lastName}`}
                        </label>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                disabled={loading}
                className={`${
                  loading ? "cursor-not-allowed" : "cursor-pointer"
                } px-4 py-2 bg-gray-300 rounded`}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`${
                  loading ? "cursor-not-allowed" : "cursor-pointer"
                } px-4 py-2 bg-blue-600 text-white rounded`}
              >
                Add Class
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

AddClassForm.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
};

export default AddClassForm;
