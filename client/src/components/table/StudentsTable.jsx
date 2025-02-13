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
import { deleteStudent } from "../../services/studentSlice";
import UpdateStudent from "../../pages/Admin/Students/UpdateStudent";

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
    dispatch(deleteStudent({ id: selectedStudent, toast: toastUtils() }));
    closeDeleteModal();
  };
  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {allStudents.length === 0 ? (
          <NoData />
        ) : (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 text-nowrap">Full Name</th>
                <th className="px-4 py-3 text-nowrap">Phone</th>
                <th className="px-4 py-3 text-nowrap">Address</th>
                <th className="px-4 py-3 text-nowrap">Email</th>
                <th className="px-4 py-3 text-nowrap">Course</th>
                <th className="px-4 py-3 text-nowrap">Year Level</th>
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
                  studentId,
                  student: { course, yearLevel },
                }) => (
                  <tr
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/student-details/${studentId}`);
                    }}
                    key={id}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {`${firstName} ${middleInitial}. ${lastName}`}
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
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {course}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {yearLevel}
                    </td>

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
                                navigate(`/student-details/${studentId}`);
                                console.log(id);
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
                                  name: `${firstName} ${middleInitial}. ${lastName}`,
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
          <UpdateStudent
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
  // fetchUpdate: PropTypes.func,
};

export default StudentsTable;
