import Cards from "../../../components/Cards";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getAllCourses, fetchCourses } from "../../../services/coursesSlice";
import { getAllStudents, fetchStudents } from "../../../services/studentSlice";
import { useSelector, useDispatch } from "react-redux";
import { getAllSubjects, fetchSubjects } from "../../../services/subjectSlice";
import { fetchUsers, getAllUsers } from "../../../services/usersSlice";
import rolesList from "../../../constants/rolesList";
import { useEffect, useState } from "react";
import {
  getAllSchoolYears,
  fetchSchoolYears,
} from "../../../services/schoolYearSlice";
import api from "../../../api/axios";

// const studentByYear = [
//   { year: "2021-2022", total: 200 },
//   { year: "2022-2023", total: 220 },
//   { year: "2023-2024", total: 250 },
//   { year: "2024-2025", total: 300 },
// ];

// const studentByCourse = [
//   { course: "BSIT", total: 100, schoolYear: "2021-2022" },
//   { course: "BSCS", total: 120, schoolYear: "2023-2023" },
//   { course: "BSIS", total: 150, schoolYear: "2023-2024" },
//   { course: "BSCE", total: 200, schoolYear: "2024-2025" },
// ];

// Fake Data for Charts
// const passFailData = [
//   { name: "Passed", value: 80 },
//   { name: "Failed", value: 20 },
// ];

// const COLORS = ["#4CAF50", "#FF5252"]; // Green for pass, Red for fail

const Dashboard = () => {
  const dispatch = useDispatch();
  const allCourse = useSelector(getAllCourses);
  const allSubjects = useSelector(getAllSubjects);
  const allStudents = useSelector(getAllStudents);
  const instructors = useSelector(getAllUsers);
  const [schoolYear, setSchoolYear] = useState("2024-2025");
  const allSchoolYears = useSelector(getAllSchoolYears);
  const [studentByCourse, setStudentByCourse] = useState([]);
  const [studentByYear, setStudentByYear] = useState([]);

  useEffect(() => {
    dispatch(fetchSchoolYears());
    dispatch(fetchUsers(rolesList.instructor));
    dispatch(fetchCourses());
    dispatch(fetchSubjects());
    dispatch(fetchStudents());

    const handleFetchStudentBySchoolYear = async () => {
      try {
        const response = await api.get(
          `/students/get-allstudent/schoolyear/${schoolYear}`
        );
        setStudentByCourse(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    handleFetchStudentBySchoolYear();

    const handleFetchStudentByYear = async () => {
      try {
        const response = await api.get("/students/get-allstudent/schoolyear");
        setStudentByYear(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    handleFetchStudentByYear();
  }, [dispatch, schoolYear]);

  const cardData = [
    { title: "Total Students", value: allStudents?.length },
    { title: "Total Instructors", value: instructors?.length },
    { title: "Total Subjects", value: allSubjects?.length },
    { title: "Total Courses", value: allCourse?.length },
  ];

  return (
    <div className="w-full">
      {" "}
      <div className=" flex flex-wrap">
        <Cards data={cardData} />
      </div>
      <div className="flex flex-col gap-8 mt-8">
        {/*       
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-center text-xl font-semibold mb-3">
            Pass vs. Fail Rate
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={passFailData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {passFailData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div> */}

        <div className="bg-white w-full overflow-x-auto shadow-md rounded-lg p-4">
          <h2 className=" text-xl font-semibold mb-3">
            Student Enrollment by School Year
          </h2>
          <div className="overflow-x-auto mt-5">
            <ResponsiveContainer width="100%" height={400} minWidth={600}>
              <BarChart data={studentByYear}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#3498db" name="School Year" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white w-full overflow-x-auto shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-center text-xl font-semibold mb-3">
              Student Enrollment by Course
            </h2>
            <select
              value={schoolYear}
              onChange={(e) => setSchoolYear(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">Select School Year</option>
              {allSchoolYears.map(({ schoolYear }) => (
                <option key={schoolYear} value={schoolYear}>
                  {schoolYear}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Wrap the ResponsiveContainer in a div with a minimum width */}
          <div className="overflow-x-auto mt-5">
            <ResponsiveContainer width="100%" height={400} minWidth={600}>
              <BarChart data={studentByCourse}>
                {/* ✅ Prevent X-Axis labels from overlapping */}
                <XAxis
                  dataKey="course"
                  tick={{ angle: -45, fontSize: 12 }}
                  tickMargin={10} // ✅ Increases space between bars and text
                  interval={0} // ✅ Ensures all labels appear
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#9b59b6" name="Course" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
