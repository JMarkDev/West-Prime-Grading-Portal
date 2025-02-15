import { useState } from "react";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import DeleteModal from "../DeleteModal";
import { useDispatch } from "react-redux";
import { toastUtils } from "../../hooks/useToast";
import NoData from "../NoData";
import { BsThreeDots } from "react-icons/bs";
import { MdPreview } from "react-icons/md";
import UpdateClass from "../../pages/Admin/StudentClass/UpdateClass";
import { deleteClass, filterClasses } from "../../services/classSlice";

const ClassTable = ({ allClasses }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [deleteModal, setDeleteModal] = useState(false);
  const [name, setName] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [instructorId, setInstructorId] = useState(null);
  const [semester, setSemester] = useState(null);
  const [schoolYear, setSchoolYear] = useState(null);
  const [subjectCode, setSubjectCode] = useState(null);

  const openDeleteModal = ({
    instructorId,
    subjectCode,
    semester,
    schoolYear,
    name,
  }) => {
    setName(name);
    setDeleteModal(true);
    setSelectedStudent(instructorId);
    setInstructorId(instructorId);
    setSemester(semester);
    setSchoolYear(schoolYear);
    setSubjectCode(subjectCode);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
  };

  const openEditModal = (id) => {
    setSelectedStudent(id);
    setEditModal(true);
  };

  const handleDelete = async () => {
    try {
      await dispatch(
        deleteClass({
          instructorId,
          subjectCode,
          semester,
          schoolYear,
          toast: toastUtils(),
        })
      ).unwrap(); // Ensures we catch errors properly

      // Refresh class list after deletion
      dispatch(
        filterClasses({
          name: "",
          semester: "all",
          schoolYear: "all",
        })
      );

      // Close modal after successful deletion
      closeDeleteModal();
    } catch (error) {
      toastUtils().error("Failed to delete class");
      console.error("Error deleting class:", error);
    }
  };

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {allClasses.length === 0 ? (
          <NoData />
        ) : (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 text-nowrap">Subject Code</th>
                <th className="px-4 py-3 text-nowrap">Description</th>
                <th className="px-4 py-3 text-nowrap">Instructor</th>
                <th className="px-4 py-3 text-nowrap">Semester</th>
                <th className="px-4 py-3 text-nowrap">Course</th>

                <th className="px-4 py-3 text-nowrap">School Year</th>
                <th className="px-4 py-3 text-center text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allClasses.map(
                (
                  {
                    subjectCode,
                    description,
                    instructor,
                    semester,
                    schoolYear,
                    course,
                    instructorId,
                  },
                  index
                ) => (
                  <tr
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/class-details/${index}`, {
                        state: {
                          instructorId,
                          semester,
                          schoolYear,
                          subjectCode,
                        },
                      });
                    }}
                    key={index}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {subjectCode}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {description}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {instructor}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {semester}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {course}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {schoolYear}
                    </td>
                    <td className="px-6 py-4 flex gap-3 justify-center items-center relative">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            setOpenAction(index === openAction ? null : index);
                            e.stopPropagation();
                          }}
                          className="text-2xl text-gray-800 font-semibold"
                        >
                          <BsThreeDots />
                        </button>

                        {openAction === index && (
                          <div
                            onMouseLeave={() => setOpenAction(null)}
                            className={`z-20 absolute flex flex-col right-[-25px]  bottom-2 w-48 py-2 mt-2 bg-white rounded-md shadow-2xl transform translate-y-full`}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/class-details/${index}`, {
                                  state: {
                                    instructorId,
                                    semester,
                                    schoolYear,
                                    subjectCode,
                                  },
                                });
                              }}
                              className="w-full flex text-green-700 items-center gap-2 py-2 px-4 text-left hover:bg-gray-300 dark:hover:bg-gray-700"
                            >
                              <span>
                                <MdPreview className="h-4 w-4" />
                              </span>
                              View
                            </button>
                            <button
                              onClick={(e) => {
                                openEditModal(index);
                                e.stopPropagation();
                                setInstructorId(instructorId);
                                setSemester(semester);
                                setSchoolYear(schoolYear);
                                setSubjectCode(subjectCode);
                              }}
                              className="w-full flex items-center gap-2 text-blue-500 py-2 px-4 text-left hover:bg-gray-300 dark:hover:bg-gray-700"
                            >
                              <span>
                                <FaRegEdit className="h-4 w-4" />
                              </span>
                              Manage Class
                            </button>
                            <button
                              onClick={(e) => {
                                openDeleteModal({
                                  index,
                                  name: `${subjectCode} - ${description}`,
                                  instructorId,
                                  subjectCode,
                                  semester,
                                  schoolYear,
                                });
                                e.stopPropagation();
                              }}
                              className="w-full flex items-center gap-2 text-red-500 py-2 px-4 text-left hover:bg-gray-300 dark:hover:bg-gray-700"
                            >
                              <span>
                                <FaTrashAlt className="h-4 w-4" />
                              </span>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
        {editModal && (
          <UpdateClass
            id={selectedStudent}
            showModal={editModal}
            setShowModal={setEditModal}
            instructorId={instructorId}
            semester={semester}
            schoolYear={schoolYear}
            subjectCode={subjectCode}
          />
        )}
        {deleteModal && (
          <DeleteModal
            title={name}
            deleteModal={deleteModal}
            closeDeleteModal={closeDeleteModal}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </>
  );
};

ClassTable.propTypes = {
  allClasses: PropTypes.array.isRequired,
  // fetchUpdate: PropTypes.func,
};

export default ClassTable;
