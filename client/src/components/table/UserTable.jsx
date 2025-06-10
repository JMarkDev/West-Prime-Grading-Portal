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
import { deleteUser } from "../../services/usersSlice";
import UpdateUser from "../../pages/Shared/UpdateUser";

const StudentsTable = ({ allStudents }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [deleteModal, setDeleteModal] = useState(false);
  const [name, setName] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const openDeleteModal = ({ id, name }) => {
    setName(name);
    setDeleteModal(true);
    setSelectedStudent(id);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
  };

  const openEditModal = (id) => {
    setSelectedStudent(id);
    setEditModal(true);
  };

  const handleDelete = () => {
    dispatch(deleteUser({ id: selectedStudent, toast: toastUtils() }));
    closeDeleteModal();
  };

  // Function to determine row color based on grade status
  const getRowColor = (student) => {
    console.log(student);
    // Check if student has gradeStatus and if the user is an instructor (role === 2)
    if (student.role === 2 && student.gradeStatus) {
      switch (student.gradeStatus.status) {
        case "completed":
          return "bg-blue-100";
        case "pending":
          return "bg-[#faed89]";
        default:
          return "";
      }
    }
    return "";
  };

  // Function to format grade status for display
  const formatGradeStatus = (student) => {
    if (student.role === 2 && student.gradeStatus) {
      const { status, submittedSubjects, totalSubjects, schoolYear, semester } =
        student.gradeStatus;

      return (
        <div className="text-xs">
          <span
            className={`font-medium ${
              status === "completed" ? "text-green-600" : "text-gray-600"
            }`}
          >
            {status === "completed" ? "Completed" : "Pending"}
          </span>
          <div className="text-gray-500">
            {submittedSubjects}/{totalSubjects} subjects
          </div>
          <div className="text-gray-500">
            {schoolYear}, {semester}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {allStudents.length === 0 ? (
          <NoData />
        ) : (
          <>
            {/* Status indicator legend */}
            {allStudents.some((student) => student.role === 2) && (
              <div className="flex items-center gap-4 p-2 bg-white mb-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
                  <span className="text-sm text-gray-700">Completed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#faed89] rounded mr-2"></div>
                  <span className="text-sm text-gray-700">Pending/Partial</span>
                </div>
              </div>
            )}

            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3 text-nowrap">Full Name</th>
                  <th className="px-4 py-3 text-nowrap">Phone</th>
                  <th className="px-4 py-3 text-nowrap">Address</th>
                  <th className="px-4 py-3 text-nowrap">Email</th>
                  {allStudents.some((student) => student.role === 2) && (
                    <th className="px-4 py-3 text-nowrap">Grade Status</th>
                  )}
                  <th className="px-4 py-3 text-center text-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allStudents.map(
                  ({
                    id,
                    firstName,
                    lastName,
                    middleInitial,
                    address,
                    contactNumber,
                    email,
                    role,
                    gradeStatus,
                  }) => (
                    <tr
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user-details/${id}`);
                      }}
                      key={id}
                      className={`${getRowColor({
                        role,
                        gradeStatus,
                      })} hover:bg-gray-200 cursor-pointer`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                        {`${firstName} ${
                          middleInitial ? middleInitial + "." : ""
                        } ${lastName}`}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                        {contactNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                        {address}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                        {email}
                      </td>

                      {allStudents.some((student) => student.role === 2) && (
                        <td className="px-4 py-4 whitespace-nowrap">
                          {formatGradeStatus({ role, gradeStatus })}
                        </td>
                      )}

                      <td className="px-6 py-4 flex gap-3 justify-center items-center relative">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              setOpenAction(id === openAction ? null : id);
                              e.stopPropagation();
                            }}
                            className="text-2xl text-gray-800 font-semibold"
                          >
                            <BsThreeDots />
                          </button>

                          {openAction === id && (
                            <div
                              onMouseLeave={() => setOpenAction(null)}
                              className={`z-20 absolute flex flex-col right-[-25px]  bottom-2 w-48 py-2 mt-2 bg-white rounded-md shadow-2xl transform translate-y-full`}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/user-details/${id}`);
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
                                  openEditModal(id);
                                  e.stopPropagation();
                                }}
                                className="w-full flex items-center gap-2 text-blue-500 py-2 px-4 text-left hover:bg-gray-300 dark:hover:bg-gray-700"
                              >
                                <span>
                                  <FaRegEdit className="h-4 w-4" />
                                </span>
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  openDeleteModal({
                                    id,
                                    name: `${firstName} ${
                                      middleInitial ? middleInitial + "." : ""
                                    } ${lastName}`,
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
          </>
        )}
        {editModal && (
          <UpdateUser
            id={selectedStudent}
            showModal={editModal}
            setShowModal={setEditModal}
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

StudentsTable.propTypes = {
  allStudents: PropTypes.array.isRequired,
};

export default StudentsTable;
