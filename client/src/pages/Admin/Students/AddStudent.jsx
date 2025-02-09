import PropTypes from "prop-types";
import api from "../../../api/axios";
import { useForm } from "react-hook-form";
import LoginLoading from "../../../components/loader/loginloader/LoginLoading";
import { useEffect, useState } from "react";
import { useToast } from "../../../hooks/useToast";
import { FiEyeOff, FiEye } from "react-icons/fi";
import rolesList from "../../../constants/rolesList";
import { fetchStudents } from "../../../services/studentSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, getAllCourses } from "../../../services/coursesSlice";

const AddStudent = ({ showModal, setShowModal }) => {
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const toast = useToast();
  const courses = useSelector(getAllCourses);
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  // Error state for backend validation messages
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [middleInitialError, setMiddleInitialError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [contactError, setContactError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmpasswordError] = useState("");
  const [courseError, setCourseError] = useState("");
  const [yearLevelError, setYearLevelError] = useState("");

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const onSubmit = async (data) => {
    data.role = rolesList.student;
    setLoading(true);

    setFirstnameError("");
    setLastnameError("");
    setMiddleInitialError("");
    setEmailError("");

    setContactError("");
    setPasswordError("");
    setConfirmpasswordError("");
    setAddressError("");
    setCourseError("");
    setYearLevelError("");

    try {
      const response = await api.post("/auth/register", data);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        dispatch(fetchStudents());
        setLoading(false);
        setShowModal(false);
      }
    } catch (error) {
      console.log(error.response.data);
      setLoading(false);

      if (error.response.data.errors) {
        error.response.data.errors.forEach((error) => {
          switch (error.path) {
            case "firstName":
              setFirstnameError(error.msg);
              break;
            case "lastName":
              setLastnameError(error.msg);
              break;
            case "middleInitial":
              setMiddleInitialError(error.msg);
              break;
            case "course":
              setCourseError(error.msg);
              break;
            case "yearLevel":
              setYearLevelError(error.msg);
              break;
            case "email":
              setEmailError(error.msg);
              break;
            case "contactNumber":
              setContactError(error.msg);
              break;
            case "address":
              setAddressError(error.msg);
              break;
            case "password":
              setPasswordError(error.msg);
              break;
            case "confirmPassword":
              setConfirmpasswordError(error.msg);
              break;
            default:
              console.log(error);
          }
        });
      }
      toast.error(error.response.data.message);
    }
  };

  const handleShowPass = () => {
    setShowPass(!showPass);
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
        <div className="relative w-full max-w-2xl max-h-full py-5 ">
          <div className="relative text-gray-800 bg-white rounded-xl shadow-lg">
            <div className="flex items-center justify-center">
              <h1 className="md:text-2xl font-bold text-lg p-4">
                Add New Student
              </h1>
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-6 h-6 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setShowModal(false)}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4  space-y-4 text-sm text-[#221f1f]">
              <form
                onSubmit={handleSubmit(onSubmit)}
                method="POST"
                encType="multipart/form-data"
                className="flex flex-col gap-4"
              >
                <div className="flex justify-between md:flex-row flex-col gap-4">
                  <div className="flex md:w-1/3 flex-col">
                    <label
                      htmlFor="first_name"
                      className="text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      {...register("firstName")}
                      type="text"
                      id="first_name"
                      className={`${
                        firstnameError ? "border-red-500 " : "border-gray-300 "
                      } p-2.5  w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                      placeholder="Enter First Name"
                    />

                    {firstnameError && (
                      <span className="text-red-500">{firstnameError}</span>
                    )}
                  </div>

                  <div className="flex md:w-1/3 flex-col">
                    <label
                      htmlFor="last_name"
                      className=" text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <input
                      {...register("lastName")}
                      type="text"
                      id="last_name"
                      className={`${
                        lastnameError ? "border-red-500 " : "border-gray-300 "
                      } p-2.5  w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                      placeholder="Enter Last Name"
                    />

                    {lastnameError && (
                      <span className="text-red-500">{lastnameError}</span>
                    )}
                  </div>
                  <div className="flex md:w-1/3 flex-col">
                    <label
                      htmlFor="middle_initial"
                      className="text-sm font-medium text-gray-700"
                    >
                      Middle Initial
                    </label>
                    <input
                      {...register("middleInitial")}
                      type="text"
                      id="middle_initial"
                      className={`${
                        middleInitialError
                          ? "border-red-500 "
                          : "border-gray-300 "
                      } p-2.5  w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                      placeholder="Enter Middle Initial"
                    />
                    {middleInitialError && (
                      <span className="text-red-500">{middleInitialError}</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between md:flex-row flex-col gap-5">
                  <div className="flex flex-col flex-grow ">
                    <label
                      htmlFor="course"
                      className="text-sm font-medium text-gray-700"
                    >
                      Course
                    </label>
                    <select
                      {...register("course")}
                      type="text"
                      id="course"
                      className={`${
                        courseError ? "border-red-500 " : "border-gray-300 "
                      } p-2.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                      placeholder="Select Course"
                    >
                      <option value="">Select Course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.courseCode}>
                          {course.courseName}
                        </option>
                      ))}
                    </select>

                    {courseError && (
                      <span className="text-red-500">{courseError}</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between md:flex-row flex-col gap-5">
                  <div className="flex flex-col flex-grow ">
                    <label
                      htmlFor="yearLevel"
                      className="text-sm font-medium text-gray-700"
                    >
                      Year Level
                    </label>
                    <select
                      {...register("yearLevel")}
                      type="text"
                      id="yearLevel"
                      className={`${
                        yearLevelError ? "border-red-500 " : "border-gray-300 "
                      } p-2.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                      placeholder=" "
                    >
                      <option value="">Select Year Level</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>

                    {yearLevelError && (
                      <span className="text-red-500">{yearLevelError}</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between md:flex-row flex-col gap-5">
                  <div className="flex flex-col flex-grow ">
                    <label
                      htmlFor="address"
                      className="text-sm font-medium text-gray-700"
                    >
                      Address
                    </label>
                    <input
                      {...register("address")}
                      type="text"
                      id="address"
                      className={`${
                        addressError ? "border-red-500 " : "border-gray-300 "
                      } p-2.5   w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                      placeholder="Enter Address"
                    />

                    {addressError && (
                      <span className="text-red-500">{addressError}</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between md:flex-row flex-col gap-5">
                  <div className="flex flex-col flex-grow  ">
                    <label
                      htmlFor="contact_number"
                      className="text-sm font-medium text-gray-700"
                    >
                      Contact Number
                    </label>
                    <input
                      {...register("contactNumber")}
                      type="number"
                      id="contact_number"
                      className={`${
                        contactError ? "border-red-500 " : "border-gray-300 "
                      } p-2.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                      placeholder="Enter Contact Number"
                    />

                    {contactError && (
                      <span className="text-red-500">{contactError}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    {...register("email")}
                    type="text"
                    id="email"
                    className={`${
                      emailError ? "border-red-500 " : "border-gray-300 "
                    } p-2.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                    placeholder="Enter Email Address"
                  />

                  {emailError && (
                    <span className="text-red-500">{emailError}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("password")}
                      // type="text"
                      type={showPass ? "text" : "password"}
                      id="password"
                      className={`${
                        passwordError ? "border-red-500 " : "border-gray-300 "
                      } p-2.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                      placeholder="Enter Password"
                    />

                    <span
                      onClick={handleShowPass}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg text-gray-700 cursor-pointer"
                    >
                      {showPass ? <FiEye /> : <FiEyeOff />}
                    </span>
                  </div>
                  {passwordError && (
                    <span className="text-red-500">{passwordError}</span>
                  )}
                </div>
                <div className="flex flex-col ">
                  <label
                    htmlFor="confirm_password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("confirmPassword")}
                      type={showPass ? "text" : "password"}
                      id="confirm_password"
                      className={`${
                        confirmPasswordError
                          ? "border-red-500 "
                          : "border-gray-300 "
                      } p-2.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                      placeholder="Enter Confirm Password"
                    />
                    <span
                      onClick={handleShowPass}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg text-gray-700 cursor-pointer"
                    >
                      {showPass ? <FiEye /> : <FiEyeOff />}
                    </span>
                  </div>
                  {confirmPasswordError && (
                    <span className="text-red-500">{confirmPasswordError}</span>
                  )}
                </div>
                <div className="flex justify-end items-center text-sm gap-4">
                  <button
                    disabled={loading ? true : false}
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={`${
                      loading ? "cursor-not-allowed" : "cursor-pointer"
                    } w-fit  mt-6 p-2.5 px-4 bg-gray-200 hover:bg-gray-300 hover:bg-primary_hover text-gray-700 rounded-lg`}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={loading ? true : false}
                    type="submit"
                    className={`${
                      loading ? "cursor-not-allowed" : "cursor-pointer"
                    } w-fit  mt-6 p-2.5 px-4 bg-main hover:bg-main_hover text-[#fff]  rounded-lg`}
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

AddStudent.propTypes = {
  showModal: PropTypes.bool,
  setShowModal: PropTypes.func,
};

export default AddStudent;
