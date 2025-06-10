import { useState } from "react";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import DeleteModal from "../DeleteModal";
import { useToast } from "../../hooks/useToast";
import NoData from "../NoData";
import { useFormat } from "../../hooks/useFormatDate";
import api from "../../api/axios";
import UpdateSubmission from "../../pages/Admin/DeadlineSubmission/UpdateSumission";

const SubjectTable = ({ allSubmission, getAllSubmission }) => {
  // const navigate = useNavigate();
  const toast = useToast();
  const { dateFormat } = useFormat();
  const [deleteModal, setDeleteModal] = useState(false);
  const [name, setName] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [selectedSumission, setSelectedSubmission] = useState(null);

  const openDeleteModal = ({ id, name }) => {
    setName(name);
    setSelectedSubmission(id);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
  };

  const openEditModal = (id) => {
    setEditModal(true);
    setSelectedSubmission(id);
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/submission/${selectedSumission}`);
      toast.success(response.data.message);
      setTimeout(() => {
        getAllSubmission();
        setDeleteModal(false);
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {allSubmission.length === 0 ? (
          <NoData />
        ) : (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 text-center text-nowrap">
                  School Year
                </th>
                <th className="px-4 py-3 text-center text-nowrap">Semester</th>
                <th className="px-4 py-3 text-center text-nowrap">
                  Date and Time
                </th>

                <th className="px-4 py-3 text-center text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allSubmission.map(
                ({ id, schoolYear, semester, dateAndTime }) => (
                  <tr
                    // onClick={(e) => {
                    //   e.stopPropagation();
                    //   navigate(`/transaction/${id}`);
                    // }}
                    key={id}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {schoolYear}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {semester}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {dateFormat(dateAndTime)}
                    </td>

                    <td className=" py-4 flex gap-3 justify-center items-center relative">
                      {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/transaction/${id}`);
                        console.log(id);
                      }}
                      className="w-fit flex text-green-700 items-center gap-2 py-2 px-4 text-left hover:bg-gray-300 dark:hover:bg-gray-700"
                    >
                      <span>
                        <MdPreview className="h-4 w-4" />
                      </span>
                      View
                    </button> */}
                      <button
                        onClick={(e) => {
                          openEditModal(id);
                          e.stopPropagation();
                        }}
                        className="w-fit flex items-center gap-2 text-blue-500 py-2 px-4 text-left hover:bg-gray-300 dark:hover:bg-gray-700"
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
                            name: dateFormat(dateAndTime),
                          });
                          e.stopPropagation();
                        }}
                        className="w-fit flex items-center gap-2 text-red-500 py-2 px-4 text-left hover:bg-gray-300 dark:hover:bg-gray-700"
                      >
                        <span>
                          <FaTrashAlt className="h-4 w-4" />
                        </span>
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
        {/* modal, closeModal, fetchUpdate, id */}
        {editModal && (
          <UpdateSubmission
            showModal={editModal}
            setEditModal={setEditModal}
            id={selectedSumission}
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

SubjectTable.propTypes = {
  allSubmission: PropTypes.array.isRequired,
  getAllSubmission: PropTypes.func,
};

export default SubjectTable;
