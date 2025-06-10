import westprimeLogo from "../../assets/images/west_prime_logo-removebg-preview.png";
import propTypes from "prop-types";
import { getUserData } from "../../services/authSlice";
import { useSelector } from "react-redux";
import rolesList from "../../constants/rolesList";

const PrintBySem = ({ filterBySem, contentRef }) => {
  const userData = useSelector(getUserData);

  return (
    <div
      ref={contentRef}
      className="w-[8.5in] h-[11in] pr-[.8in] pb-[.8in] pl-[.8in] pt-[0.5in] font-sans text-[14px]"
    >
      {/* <div
  ref={contentRef}
  className="w-[8.5in] h-[11in] pt-[0.5in] pr-[1in] pb-[1in] pl-[1in] font-sans text-[14px]"
> */}

      {/* Header */}
      <div className="flex relative items-center gap-4 mb-6">
        <img
          src={westprimeLogo}
          alt="West Prime Logo"
          className="w-28 absolute left-0"
        />
        <div className="text-center flex-1">
          <h1 className="font-bold text-lg">
            West Prime Horizon Institute, Inc.
          </h1>
          <p>West Prime Horizon Institute Building</p>
          <p>V. Sagun cor. M. Roxas St.</p>
          <p>San Francisco Dist. Pagadian City</p>
          <p>Cell No.: 0920-798-3228 (Smart)</p>
          <p>
            Email Address:{" "}
            <span className="text-gray-500">wephi0217@gmail.com</span>
          </p>
        </div>
      </div>

      {userData && userData.role === rolesList.admin && (
        <h2 className="text-center font-bold mb-6">CERTIFICATE OF GRADES</h2>
      )}

      {/* Student Info */}
      <div className="mb-6 space-y-2 text-sm">
        <div className="flex">
          <span className="w-24 font-semibold">Name:</span>
          <span className="border-b w-fit border-black font-semibold">
            {filterBySem?.studentName}
          </span>
        </div>
        {/* <div className="flex">
          <span className="w-24 font-semibold">Student ID:</span>
          <span>{filterBySem?.studentId}</span>
        </div> */}
        <div className="flex">
          <span className="w-24 font-semibold">Year Level:</span>
          <span>{filterBySem?.yearLevel}</span>
        </div>
        <div className="flex">
          <span className="w-24 font-semibold">Course:</span>
          <span>{filterBySem?.course}</span>
        </div>
      </div>

      {/* Grades Table */}
      <table className="w-full border border-black border-collapse">
        <thead>
          <tr>
            <th
              colSpan={3}
              className="border bg-blue-300 border-black p-2 uppercase text-center font-semibold"
            >
              {filterBySem?.academicRecords[0]?.semester} S.Y.{" "}
              {filterBySem?.academicRecords[0]?.schoolYear}
            </th>
          </tr>
          <tr>
            <th className="border border-black p-1">Code</th>
            <th className="border border-black p-1">Subject</th>
            <th className="border border-black p-1">Final Grade</th>
          </tr>
        </thead>
        <tbody>
          {filterBySem?.academicRecords[0]?.subjects?.map(
            ({ subjectCode, description, grade }, index) => (
              <tr key={index}>
                <td className="border text-center border-black p-1">
                  {subjectCode}
                </td>
                <td className="border text-center border-black p-1">
                  {description}
                </td>
                <td className="border text-center border-black p-1">{grade}</td>
              </tr>
            )
          )}

          {/* General Average Row */}
          <tr>
            <td className="border border-black p-1"></td>
            <td className="border text-center border-black p-1 font-bold pr-2">
              GENERAL AVERAGE:
            </td>
            <td className="border border-black p-1 text-center font-bold">
              {(() => {
                const subjects =
                  filterBySem?.academicRecords[0]?.subjects || [];

                // Filter out subjects with null, undefined, or non-positive numeric grades
                const validGrades = subjects
                  .map((sub) => parseFloat(sub.grade))
                  .filter((grade) => !isNaN(grade) && grade > 0);

                const average = validGrades.length
                  ? (
                      validGrades.reduce((sum, grade) => sum + grade, 0) /
                      validGrades.length
                    ).toFixed(2)
                  : "N/A";

                return average;
              })()}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Signature */}
      {userData?.role === rolesList.admin ? (
        <>
          {/* Footer */}
          <div className="mt-8 text-justify text-sm leading-relaxed indent-8">
            <p>
              This certificate is being issued upon the aforementioned name for
              whatever legal purpose it may serve his/her best.
            </p>
            <p className="mt-2">
              Given this {new Date().getDate()}
              <sup>
                {["st", "nd", "rd"][
                  ((((new Date().getDate() + 90) % 100) - 10) % 10) - 1
                ] || "th"}
              </sup>{" "}
              day of {new Date().toLocaleString("default", { month: "long" })},{" "}
              {new Date().getFullYear()} at San Francisco Dist., Pagadian City.
            </p>
          </div>

          <div className="mt-16">
            <p className="font-bold">HILDA D. ALCASID</p>
            <p>School Registrar</p>
          </div>
        </>
      ) : userData?.role === rolesList.instructor ? (
        <div className="mt-16">
          <p className="font-bold">{`${userData.firstName} ${userData?.middleInitial}. ${userData.lastName}`}</p>
          <p>School Faculty</p>
        </div>
      ) : null}
    </div>
  );
};

PrintBySem.propTypes = {
  filterBySem: propTypes.object,
  contentRef: propTypes.object,
};

export default PrintBySem;
