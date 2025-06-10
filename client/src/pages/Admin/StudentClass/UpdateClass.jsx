import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterStudents, getAllStudents } from "../../../services/studentSlice";
import LoginLoading from "../../../components/loader/loginloader/LoginLoading";
import api from "../../../api/axios";
import { useToast } from "../../../hooks/useToast";
import {
  getClassByInstructorSemSySubjectCode,
  getClassByInstructor,
  removeFromClass,
  addStudentToClass,
} from "../../../services/classSlice";
import { fetchUsers, getAllUsers } from "../../../services/usersSlice";
import rolesList from "../../../constants/rolesList";
import { getAllSubjects, fetchSubjects } from "../../../services/subjectSlice";
import { filterClasses } from "../../../services/classSlice";

const AddClassForm = ({
  showModal,
  setShowModal,
  instructorId,
  semester,
  schoolYear,
  subjectCode,
}) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const instructors = useSelector(getAllUsers);
  const subjects = useSelector(getAllSubjects);
  const { handleSubmit } = useForm();
  const selectedSubject = useSelector(getClassByInstructor);
  const students = useSelector(getAllStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [instructor, setIntructor] = useState("");
  const [selectedSubjectCode, setSubjectCode] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [selectedInstructorId, setInstructorId] = useState("");

  useEffect(() => {
    dispatch(fetchUsers(rolesList.instructor));
    dispatch(fetchSubjects());
    if (searchTerm) {
      dispatch(filterStudents({ name: searchTerm, course: "", yearLevel: "" }));
    }
    dispatch(
      getClassByInstructorSemSySubjectCode({
        instructorId,
        semester,
        schoolYear,
        subjectCode,
      })
    );
  }, [dispatch, instructorId, semester, schoolYear, subjectCode, searchTerm]);

  useEffect(() => {
    if (selectedSubject?.instructor) {
      setIntructor(selectedSubject?.instructor);
      setSubjectId(selectedSubject?.subjectId);
      setSubjectCode(selectedSubject.subjectCode);
      setDescription(selectedSubject.description);
      setSubjectId(selectedSubject.subjectId);
      setInstructorId(selectedSubject?.instructorId);
    }
  }, [selectedSubject, subjects]);

  // const onSubmit = async () => {
  //   // setLoading(true);

  //   if (selectedSubject.students.length === 0) {
  //     setLoading(false);
  //     toast.error("Please select at least one student");
  //     return;
  //   }

  // try {
  //   const response = await api.post("/classes/add", data);
  //   if (response.data.status === 201) {
  //     toast.success(response.data.message);
  //     setTimeout(() => {
  //       setShowModal(false);
  //     }, 1000);
  //   }
  // } catch (error) {
  //   setLoading(false);
  //   toast.error(error.response.data.message);
  //   console.error(error);
  // }
  // };

  const handleAddStudent = async ({
    studentId,
    studentName,
    subjectId,
    subjectCode,
    description,
    instructorId,
    instructor,
    semester,
    schoolYear,
    course,
    yearLevel,
  }) => {
    try {
      await dispatch(
        addStudentToClass({
          studentId,
          studentName,
          subjectId,
          subjectCode,
          description,
          instructorId,
          instructor,
          semester,
          schoolYear,
          course,
          yearLevel,
        })
      ).unwrap();

      toast.success("Student added successfully");

      // Refresh the class list only if no error occurs
      setTimeout(() => {
        dispatch(
          getClassByInstructorSemSySubjectCode({
            instructorId,
            semester,
            schoolYear,
            subjectCode,
          })
        );
      }, 1000);
    } catch (error) {
      console.error("Error adding student:", error);

      // Display the actual backend error message
      toast.error(
        error?.message || "An error occurred while adding the student."
      );
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      await dispatch(removeFromClass(studentId)).unwrap();
      toast.success("Student removed successfully");

      // Refresh the class list
      dispatch(
        getClassByInstructorSemSySubjectCode({
          instructorId,
          semester,
          schoolYear,
          subjectCode,
        })
      );
    } catch (error) {
      toast.error("Failed to remove student");
    }
  };

  const updateClass = async (id) => {
    setLoading(true);

    const data = {
      instructor: instructor,
      instructorId: selectedInstructorId,
      subjectCode: selectedSubjectCode,
      description: description,
      subjectId: subjectId,
      schoolYear: selectedSubject?.schoolYear,
      yearLevel: selectedSubject?.yearLevel,
      semester: selectedSubject?.semester,
    };
    // subjectId,
    // yearLevel,
    // semester,
    // schoolYear,
    // instructor,
    // instructorId,
    // subjectCode,
    // description,
    setShowModal(false), console.log(data);
    try {
      const response = await api.put(`/classes/update/${id}`, data);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        dispatch(
          filterClasses({
            name: "",
            semester: "all",
            schoolYear: "all",
            course: "all",
            yearLevel: "all",
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        id="default-modal"
        tabIndex="-1"
        aria-hidden={!showModal}
        className="fixed overflow-y-auto overflow-hidden  inset-0 z-50 px-4 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-40 font-normal"
      >
        {loading && <LoginLoading />}
        <div className="w-full mx-5 max-w-3xl bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Update Class</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Instructor</label>
              <select
                value={selectedInstructorId || ""} // <-- this is important
                onChange={(e) => {
                  const selectedInstructor = instructors.find(
                    (inst) => inst.id.toString() === e.target.value
                  );
                  if (selectedInstructor) {
                    setIntructor(
                      `${selectedInstructor.firstName} ${selectedInstructor.middleInitial}. ${selectedInstructor.lastName}`
                    );
                    setInstructorId(selectedInstructor.id);
                  }
                }}
                className="border border-gray-300 rounded-lg bg-gray-50 p-3 w-full shadow-sm"
              >
                <option value="">Select Instructor</option>{" "}
                {/* optional default */}
                {instructors?.map(
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
              <select
                value={subjectId || ""} // <-- controlled value here too
                onChange={(e) => {
                  const selectedSubject = subjects.find(
                    (sub) => sub.id.toString() === e.target.value
                  );
                  if (selectedSubject) {
                    setSubjectCode(selectedSubject.subjectCode);
                    setDescription(selectedSubject.description);
                    setSubjectId(selectedSubject.id);
                  }
                }}
                className="border w-full border-gray-300 rounded-lg bg-gray-50 p-3 shadow-sm"
              >
                <option value="">Select Subject</option>{" "}
                {/* optional default */}
                {subjects?.map(({ id, subjectCode, description }) => (
                  <option key={id} value={id}>
                    {subjectCode} - {description}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-4">
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
                </div>
                {students.length > 0 && searchTerm ? (
                  <div className="border rounded-lg shadow-sm bg-white p-3 max-h-52 overflow-y-auto">
                    <ul className="space-y-2">
                      {students.map(
                        ({ studentId, firstName, lastName, middleInitial }) => (
                          <li
                            key={studentId}
                            className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <span className="text-gray-700 text-sm">
                              {`${firstName} ${middleInitial}. ${lastName}`}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                handleAddStudent({
                                  studentId: studentId,
                                  studentName: `${firstName} ${middleInitial}. ${lastName}`,
                                  subjectId: selectedSubject?.subjectId,
                                  subjectCode: selectedSubject?.subjectCode,
                                  description: selectedSubject?.description,
                                  instructorId: selectedSubject?.instructorId,
                                  instructor: selectedSubject?.instructor,
                                  semester: selectedSubject?.semester,
                                  schoolYear: selectedSubject?.schoolYear,
                                  course: selectedSubject?.course,
                                  yearLevel: selectedSubject?.yearLevel,
                                });
                              }}
                              className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                              aria-label={`Add ${firstName} ${middleInitial}. ${lastName}`}
                            >
                              Add to Class
                            </button>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                ) : null}
              </div>

              {/* Student List */}

              <div className="border rounded-lg shadow-sm bg-white p-3 max-h-52 overflow-y-auto">
                <label className="text-sm font-semibold text-gray-700">
                  Enrolled Students
                </label>
                <ul className="space-y-2">
                  {selectedSubject?.students.map(({ id, fullName }, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <span className="text-gray-700 text-sm">{fullName}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStudent(id)}
                        className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                        aria-label={`Remove ${fullName}`}
                      >
                        Remove from Class
                      </button>
                    </li>
                  ))}
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
                type="button"
                onClick={() => updateClass(selectedSubject?.id)}
                disabled={loading}
                className={`${
                  loading ? "cursor-not-allowed" : "cursor-pointer"
                } px-4 py-2 bg-blue-600 text-white rounded`}
              >
                Update
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
  instructorId: PropTypes.number,
  semester: PropTypes.string,
  schoolYear: PropTypes.string,
  subjectCode: PropTypes.string,
};

export default AddClassForm;
