import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import LoginLoading from "../../../components/loader/loginloader/LoginLoading";
import { useState } from "react";
import { useToast } from "../../../hooks/useToast";
import { useDispatch, useSelector } from "react-redux";
import { addSchoolYear } from "../../../services/schoolYearSlice";

const AddSchoolYear = ({ showModal, setShowModal }) => {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const toast = useToast();
  const { loading } = useSelector((state) => state.schoolYears);

  const [schoolYearError, setSchoolYearError] = useState("");

  const onSubmit = async (data) => {
    dispatch(addSchoolYear({ toast, data }))
      .unwrap()
      .then(() => {
        reset();
        setShowModal(false);
      })
      .catch((errors) => {
        setSchoolYearError("");

        errors.forEach((err) => {
          if (err.path === "schoolYear") {
            setSchoolYearError(err.msg);
          }
        });
      });
  };

  return (
    <div
      id="add-schoolyear-modal"
      tabIndex="-1"
      aria-hidden={!showModal}
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-40 px-4"
    >
      {loading && <LoginLoading />}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-lg font-bold text-gray-800">Add New School Year</h1>
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={() => setShowModal(false)}
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
            <input
              {...register("schoolYear")}
              type="text"
              id="school_year"
              className={`w-full p-2 border rounded-lg text-sm ${
                schoolYearError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., 2023-2024"
            />
            {schoolYearError && (
              <span className="text-red-500 text-sm">{schoolYearError}</span>
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
              {loading ? "Adding..." : "Add School Year"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddSchoolYear.propTypes = {
  showModal: PropTypes.bool,
  setShowModal: PropTypes.func,
};

export default AddSchoolYear;
