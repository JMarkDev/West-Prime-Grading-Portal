import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import LoginLoading from "../../../components/loader/loginloader/LoginLoading";
import { useToast } from "../../../hooks/useToast";
import api from "../../../api/axios";
import {
  getAllSchoolYears,
  fetchSchoolYears,
} from "../../../services/schoolYearSlice";

const UpdateSubmission = ({
  id,
  showModal,
  setEditModal,
  getAllSubmission,
}) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();
  const toast = useToast();
  const allSchoolYears = useSelector(getAllSchoolYears);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchSchoolYears());
    const fetchById = async () => {
      try {
        const response = await api.get(`/submission/${id}`);
        console.log(response.data);
        reset({
          schoolYear: response.data.schoolYear,
          semester: response.data.semester,
          dateAndTime: response.data.dateAndTime.slice(0, 16), // format for datetime-local
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchById();
  }, [dispatch, id, reset]);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await api.put(`/submission/${id}`, data);
      if (response.data.status === "success") {
        toast.success(response.data.message);

        setTimeout(() => {
          setEditModal(false);
          getAllSubmission();
        }, 300);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.response);
    }
  };

  return (
    <div
      id="add-subject-modal"
      tabIndex="-1"
      aria-hidden={!showModal}
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-40 px-4"
    >
      {loading && <LoginLoading />}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-lg font-bold text-gray-800">
          Update Submission Deadline
        </h1>
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={() => setEditModal(false)}
        >
          ✕
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* School Year */}
          <div>
            <label
              htmlFor="school_year"
              className="text-sm font-medium text-gray-700"
            >
              School Year
            </label>
            <select
              {...register("schoolYear")}
              type="text"
              id="school_year"
              className={`w-full p-2 border rounded-lg text-sm ${
                errors.schoolYear ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., 2024-2025"
            >
              <option value="">Select School Year</option>
              {allSchoolYears?.map(({ schoolYear, id }) => (
                <option key={id}>{schoolYear}</option>
              ))}
            </select>
            {errors.schoolYear && (
              <span className="text-red-500 text-sm">{errors.schoolYear}</span>
            )}
          </div>

          {/* Semester */}
          <div>
            <label
              htmlFor="semester"
              className="text-sm font-medium text-gray-700"
            >
              Semester
            </label>
            <select
              {...register("semester")}
              id="semester"
              className={`w-full p-2 border rounded-lg text-sm ${
                errors.semester ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Semester</option>
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
            </select>
            {errors.semester && (
              <span className="text-red-500 text-sm">{errors.semester}</span>
            )}
          </div>

          {/* Date and Time */}
          <div>
            <label
              htmlFor="date_and_time"
              className="text-sm font-medium text-gray-700"
            >
              Date and Time
            </label>
            <input
              {...register("dateAndTime")}
              type="datetime-local"
              id="date_and_time"
              className={`w-full p-2 border rounded-lg text-sm ${
                errors.dateAndTime ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.dateAndTime && (
              <span className="text-red-500 text-sm">{errors.dateAndTime}</span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              onClick={() => setEditModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

UpdateSubmission.propTypes = {
  id: PropTypes.number,
  showModal: PropTypes.bool,
  setShowModal: PropTypes.func,
  getAllSubmission: PropTypes.func,
};

export default UpdateSubmission;
