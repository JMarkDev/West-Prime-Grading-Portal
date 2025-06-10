// const DeadlineSubmission = () => {
//   return <div>DeadlingSubmission</div>;
// };

// export default DeadlineSubmission;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSubjects,
  fetchSubjects,
  searchSubject,
} from "../../../services/subjectSlice";
import Pagination from "../../../components/Pagination";
import { IoSearch } from "react-icons/io5";
import SubmissionTable from "../../../components/table/SubmissionTable";
import AddSubmission from "./AddSubmission";
import api from "../../../api/axios";

const DeadlineSubmission = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [allSubmission, setAllSubmission] = useState([]);
  const dataPerPage = 10;

  const getAllSubmission = async () => {
    try {
      const response = await api.get("/submission");
      setAllSubmission(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllSubmission();
  }, []);

  // Paganation
  const indexOfLastDocument = currentPage * dataPerPage;
  const indexOfFirstDocument = indexOfLastDocument - dataPerPage;
  const currentData = allSubmission?.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="flex  gap-5  flex-col">
        <div className="flex flex-col md:flex-row justify-between  w-full  gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="text-nowrap w-fit p-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded-md"
          >
            Set Submission
          </button>
          {showModal && (
            <AddSubmission
              showModal={showModal}
              setShowModal={setShowModal}
              getAllSubmission={getAllSubmission}
            />
          )}
        </div>
      </div>

      <div className="mt-8">
        <SubmissionTable
          allSubmission={currentData}
          getAllSubmission={getAllSubmission}
        />
        <div className="flex justify-end mt-5">
          <Pagination
            dataPerPage={dataPerPage}
            totalData={allSubmission?.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default DeadlineSubmission;
