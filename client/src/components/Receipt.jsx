// import PropTypes from "prop-types";
// import { getTransactionStatus } from "../utils/getTransactionStatus";

// const Receipt = ({ data, contentRef }) => (
//   <div
//     ref={contentRef}
//     className="max-w-sm mx-auto p-8 border border-gray-300 shadow-xl rounded-lg bg-white"
//   >
//     {/* Header */}
//     <div className="text-center mb-6">
//       <h2 className="text-2xl font-bold text-gray-900">
//         Animal Transaction Receipt
//       </h2>
//       <p className="text-gray-500 text-sm">
//         Transaction ID: {data?.transactionId}
//       </p>
//     </div>

//     {/* Customer Details */}
//     <div className="mb-8">
//       <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
//         Customer Details
//       </h3>
//       <div className="text-sm space-y-1">
//         <p className="text-gray-600">
//           <strong>Name:</strong> {data?.owner?.customerName}
//         </p>
//         <p className="text-gray-600">
//           <strong>Address:</strong> {data?.owner?.customerAddress}
//         </p>
//         <p className="text-gray-600">
//           <strong>Phone Number:</strong> {data?.owner?.customerPhone}
//         </p>
//       </div>
//     </div>

//     {/* Animal Transaction Details */}
//     <div className="mb-8">
//       <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
//         Animal Transaction Details
//       </h3>
//       <div className="text-sm space-y-1">
//         <p className="text-gray-600">
//           <strong>Animal Type:</strong> {data?.type}
//         </p>
//         <p className="text-gray-600">
//           <strong>Date Slaughtered:</strong> {data?.slaughterDate}
//         </p>
//         <p className="text-gray-600">
//           <strong>Total Weight (Kg):</strong> {data?.weight} Kg
//         </p>
//         <p className="text-gray-600">
//           <strong>Price per Kg:</strong> ₱{data?.pricePerKg}
//         </p>
//         <p className="text-gray-600">
//           <strong>Total Price:</strong> ₱{data?.total}
//         </p>
//       </div>
//     </div>

//     {/* Payment Summary */}
//     <div className="mb-6">
//       <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
//         Payment Summary
//       </h3>
//       <div className="text-sm space-y-1">
//         <p className="text-gray-600">
//           <strong>Paid Amount:</strong> ₱{data?.transaction?.amountPaid}
//         </p>
//         <p className="text-gray-600">
//           <strong>Balance:</strong> ₱{data?.transaction?.balance}
//         </p>
//         <p className={`text-gray-600`}>
//           <strong>Status:</strong>{" "}
//           {getTransactionStatus(data?.transaction?.status)}
//         </p>
//       </div>
//     </div>

//     {/* Footer */}
//     <div className="text-center mt-6 border-t border-gray-200 pt-4">
//       <p className="text-gray-500 text-xs italic">
//         Thank you for your transaction!
//       </p>
//     </div>
//   </div>
// );

// Receipt.propTypes = {
//   data: PropTypes.object,
//   contentRef: PropTypes.object,
// };

// export default Receipt;
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { getTransactionStatus } from "../utils/getTransactionStatus";

const Receipt = ({ data, contentRef }) => {
  const [animalData, setAnimalData] = useState([]);

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
    <div
      ref={contentRef}
      className="max-w-sm mx-auto p-6 border border-gray-300 shadow-lg rounded-lg bg-white"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Animal Transaction Receipt
        </h2>
        <p className="text-gray-500 text-sm">
          Transaction ID: {data?.transactionId}
        </p>
      </div>

      {/* Customer Details */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
          Customer Details
        </h3>
        <p className="text-gray-600 text-sm mb-1">
          <strong>Name:</strong> {data?.owner?.customerName}
        </p>
        <p className="text-gray-600 text-sm mb-1">
          <strong>Address:</strong> {data?.owner?.customerAddress}
        </p>
        <p className="text-gray-600 text-sm">
          <strong>Phone Number:</strong> {data?.owner?.customerPhone}
        </p>
      </div>

      {/* Animal Transaction Details */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
          Animal Transaction Details
        </h3>
        {animalData?.map((animal, index) => (
          <div key={index} className="mb-5">
            <p className="text-gray-600 text-sm mb-1">
              <strong>Animal Type:</strong> {animal.type}
            </p>
            <p className="text-gray-600 text-sm mb-1">
              <strong>Weight:</strong> {animal.weight} Kg
            </p>
            <p className="text-gray-600 text-sm mb-1">
              <strong>No. of heads:</strong> {animal.no_of_heads}
            </p>
            <p className="text-gray-600 text-sm mb-1">
              <strong>Category:</strong> {animal.category}
            </p>
            <p className="text-gray-600 text-sm mb-1">
              <strong>Price per Kg:</strong> ₱{animal.pricePerKg}
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Total Price:</strong> ₱{animal.total}
            </p>
          </div>
        ))}
      </div>

      {/* Payment Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
          Payment Summary
        </h3>
        <p className="text-gray-600 text-sm mb-1">
          <strong>Total Paid Amount:</strong> ₱{totalAmountPaid || 0}
        </p>
        <p className="text-gray-600 text-sm mb-1">
          <strong>Total Balance:</strong> ₱{totalBalance || 0}
        </p>
        <p className={`text-gray-600`}>
          <strong>Status:</strong>{" "}
          {getTransactionStatus(data?.transaction?.status)}
        </p>
      </div>

      {/* Footer */}
      <div className="text-center mt-4 border-t border-gray-200 pt-4">
        <p className="text-gray-500 text-xs italic">
          Thank you for your transaction!
        </p>
      </div>
    </div>
  );
};

Receipt.propTypes = {
  data: PropTypes.object,
  contentRef: PropTypes.object,
};

export default Receipt;
