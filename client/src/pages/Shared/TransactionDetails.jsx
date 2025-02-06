import Back from "../../components/buttons/Back";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnimalById, getAnimalById } from "../../services/animalsSlice";
import { useEffect, useState } from "react";
import { getBgColor } from "../../utils/animalBgStatus";
import { getTransactionStatus } from "../../utils/getTransactionStatus";

const TransactionDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const data = useSelector(getAnimalById);
  const [animalData, setAnimalData] = useState([]);

  useEffect(() => {
    dispatch(fetchAnimalById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (data?.receipt?.animalData) {
      try {
        const parsedData = JSON.parse(data.receipt.animalData);
        if (Array.isArray(parsedData)) {
          setAnimalData(parsedData);
        } else {
          console.error("Parsed data is not an array:", parsedData);
          setAnimalData([]);
        }
      } catch (error) {
        console.error("Failed to parse animalData:", error);
        setAnimalData([]); // Default to empty array on failure
      }
    }
  }, [data]);

  // Calculate total amount paid, balance, and other payment details
  const totalAmountPaid = Array.isArray(animalData)
    ? animalData.reduce(
        (sum, animal) => sum + parseFloat(animal.paidAmount || 0),
        0
      )
    : 0;

  const totalBalance = Array.isArray(animalData)
    ? animalData.reduce(
        (sum, animal) => sum + parseFloat(animal.balance || 0),
        0
      )
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex items-center gap-5 mb-8">
        <Back />
        <h1 className="font-bold lg:text-3xl text-xl text-gray-900">
          Transaction Details
        </h1>
      </div>
      <div className="text-sm max-w-lg mx-auto p-8 border border-gray-200 shadow-xl rounded-lg bg-white">
        <h2 className="lg:text-2xl text-lg font-semibold text-center text-gray-700 mb-6">
          Animal Transaction Receipt
        </h2>

        {/* Transaction ID */}
        <p className="text-center text-gray-600 mb-4">
          <span className="font-medium text-gray-900">Transaction ID:</span>{" "}
          {data?.transactionId}
        </p>

        {/* Customer Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-2">
            Customer Details
          </h3>
          <p className="text-gray-700 mb-1">
            <strong>Name:</strong> {data?.owner?.customerName}
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Address:</strong> {data?.owner?.customerAddress}
          </p>
          <p className="text-gray-700">
            <strong>Phone Number:</strong> {data?.owner?.customerPhone}
          </p>
        </div>

        {/* Animal Transaction Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-2">
            Animal Transaction Details
          </h3>

          {animalData.map((animal, index) => (
            <div key={index} className="mb-5">
              <p className="text-gray-700 mb-1">
                <strong>Animal Type:</strong> {animal.type}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Slaughter Date:</strong> {animal.slaughterDate}
              </p>

              <p className="text-gray-700 mb-1">
                <strong>Weight:</strong> {animal.weight} Kg
              </p>
              <p className="text-gray-700 mb-1">
                <strong>No. of Heads:</strong> {animal.no_of_heads}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Category:</strong> {animal.category}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Price per Kg:</strong> ₱{animal.pricePerKg}
              </p>
              <p className="text-gray-700">
                <strong>Total Price:</strong> ₱{animal.total}
              </p>
            </div>
          ))}
        </div>

        {/* Payment Summary */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-2">
            Payment Summary
          </h3>
          <p className="text-gray-700 mb-1">
            <strong>Total Paid Amount:</strong> ₱{totalAmountPaid || 0}
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Total Balance:</strong> ₱{totalBalance || 0}
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Status:</strong>
            <span
              className={`${getBgColor(
                data?.transaction?.status
              )} text-white w-fit px-4 py-1 rounded-lg text-center`}
            >
              {getTransactionStatus(data?.transaction?.status)}
            </span>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Thank you for your transaction!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
