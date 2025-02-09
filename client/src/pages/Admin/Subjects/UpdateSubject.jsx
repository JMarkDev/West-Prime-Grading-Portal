import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import LoginLoading from "../../../components/loader/loginloader/LoginLoading";
import { useEffect, useState } from "react";
import { useToast } from "../../../hooks/useToast";
import {
  updateSubject,
  fetchSubjectById,
  getSubjectById,
  fetchSubjects,
} from "../../../services/subjectSlice";
import { useDispatch, useSelector } from "react-redux";

const UpdateSubject = ({ id, showModal, setShowModal }) => {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const toast = useToast();
  const subject = useSelector(getSubjectById);
  const { loading } = useSelector((state) => state.subjects);

  //   const [loading, setLoading] = useState(false);
  const [subjectCodeError, setSubjectCodeError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [unitsError, setUnitsError] = useState("");

  useEffect(() => {
    if (id) dispatch(fetchSubjectById(id));
  }, [dispatch, id]);

  const onSubmit = async (data) => {
    dispatch(updateSubject({ id, toast, data }))
      .unwrap()
      .then(() => {
        reset();
        setShowModal(false);

        dispatch(fetchSubjects());
      })
      .catch((errors) => {
        // Reset previous errors
        setSubjectCodeError("");
        setDescriptionError("");
        setUnitsError("");

        errors.forEach((err) => {
          switch (err.path) {
            case "subjectCode":
              setSubjectCodeError(err.msg);
              break;
            case "description":
              setDescriptionError(err.msg);
              break;
            case "units":
              setUnitsError(err.msg);
              break;
            default:
              console.log(err);
          }
        });
      });
  };

  useEffect(() => {
    if (subject) {
      reset({
        subjectCode: subject.subjectCode,
        description: subject.description,
        units: subject.units,
      });
    }
  }, [subject, reset]);

  return (
    <div
      id="add-subject-modal"
      tabIndex="-1"
      aria-hidden={!showModal}
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-40 px-4"
    >
      {loading && <LoginLoading />}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-lg font-bold text-gray-800">Update Subject</h1>
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={() => setShowModal(false)}
        >
          ✕
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Subject Code */}
          <div>
            <label
              htmlFor="subject_code"
              className="text-sm font-medium text-gray-700"
            >
              Subject Code
            </label>
            <input
              {...register("subjectCode")}
              type="text"
              id="subject_code"
              className={`w-full p-2 border rounded-lg text-sm ${
                subjectCodeError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., CS101"
            />
            {subjectCodeError && (
              <span className="text-red-500 text-sm">{subjectCodeError}</span>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <input
              {...register("description")}
              type="text"
              id="description"
              className={`w-full p-2 border rounded-lg text-sm ${
                descriptionError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., Introduction to Computer Science"
            />
            {descriptionError && (
              <span className="text-red-500 text-sm">{descriptionError}</span>
            )}
          </div>

          {/* Units */}
          <div>
            <label
              htmlFor="units"
              className="text-sm font-medium text-gray-700"
            >
              Units
            </label>
            <input
              {...register("units")}
              type="number"
              id="units"
              className={`w-full p-2 border rounded-lg text-sm ${
                unitsError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., 3"
            />
            {unitsError && (
              <span className="text-red-500 text-sm">{unitsError}</span>
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
              {loading ? "Update..." : "Update Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

UpdateSubject.propTypes = {
  id: PropTypes.number,
  showModal: PropTypes.bool,
  setShowModal: PropTypes.func,
};

export default UpdateSubject;
