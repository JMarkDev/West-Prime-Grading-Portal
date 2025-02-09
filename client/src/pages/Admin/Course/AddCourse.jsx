import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import LoginLoading from "../../../components/loader/loginloader/LoginLoading";
import { useState } from "react";
import { useToast } from "../../../hooks/useToast";
import { addCourse } from "../../../services/coursesSlice";
import { useDispatch, useSelector } from "react-redux";

const AddCourse = ({ showModal, setShowModal }) => {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const toast = useToast();
  const { loading } = useSelector((state) => state.courses);

  const [courseCodeError, setCourseCodeError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const onSubmit = async (data) => {
    dispatch(addCourse({ toast, data }))
      .unwrap()
      .then(() => {
        reset();
        setShowModal(false);
      })
      .catch((errors) => {
        setCourseCodeError("");
        setDescriptionError("");

        errors.forEach((err) => {
          switch (err.path) {
            case "courseCode":
              setCourseCodeError(err.msg);
              break;
            case "courseName":
              setDescriptionError(err.msg);
              break;
            default:
              console.log(err);
          }
        });
      });
  };

  return (
    <div
      id="add-course-modal"
      tabIndex="-1"
      aria-hidden={!showModal}
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-40 px-4"
    >
      {loading && <LoginLoading />}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-lg font-bold text-gray-800">Add New Course</h1>
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={() => setShowModal(false)}
        >
          ✕
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Course Code */}
          <div>
            <label
              htmlFor="course_code"
              className="text-sm font-medium text-gray-700"
            >
              Course Name
            </label>
            <input
              {...register("courseCode")}
              type="text"
              id="course_code"
              className={`w-full p-2 border rounded-lg text-sm ${
                courseCodeError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., BSCS101"
            />
            {courseCodeError && (
              <span className="text-red-500 text-sm">{courseCodeError}</span>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Course Title
            </label>
            <input
              {...register("courseName")}
              type="text"
              id="courseName"
              className={`w-full p-2 border rounded-lg text-sm ${
                descriptionError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., Bachelor of Science in Computer Science"
            />
            {descriptionError && (
              <span className="text-red-500 text-sm">{descriptionError}</span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddCourse.propTypes = {
  showModal: PropTypes.bool,
  setShowModal: PropTypes.func,
};

export default AddCourse;
