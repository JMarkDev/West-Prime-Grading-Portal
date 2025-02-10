import Cards from "../../../components/Cards";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const cardData = [
  { title: "Total Students", value: 500 },
  { title: "Total Instructors", value: 50 },
  { title: "Total Subjects", value: 120 },
  { title: "Total Courses", value: 100 },
];

const studentByYear = [
  { year: "2021-2022", total: 200 },
  { year: "2022-2023", total: 220 },
  { year: "2023-2024", total: 250 },
  { year: "2024-2025", total: 300 },
];

const studentByCourse = [
  { course: "BSIT", total: 100, schoolYear: "2021-2022" },
  { course: "BSCS", total: 120, schoolYear: "2023-2023" },
  { course: "BSIS", total: 150, schoolYear: "2023-2024" },
  { course: "BSCE", total: 200, schoolYear: "2024-2025" },
];

// Fake Data for Charts
// const passFailData = [
//   { name: "Passed", value: 80 },
//   { name: "Failed", value: 20 },
// ];

const COLORS = ["#4CAF50", "#FF5252"]; // Green for pass, Red for fail

const Dashboard = () => {
  return (
    <div className="w-full">
      {" "}
      <div className=" flex flex-wrap">
        <Cards data={cardData} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
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

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-center text-xl font-semibold mb-3">
            Student Enrollment by School Year
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentByYear}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#3498db" name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-center text-xl font-semibold mb-3">
              Student Enrollment by Course
            </h2>
            <select className="border border-gray-300 rounded-md p-2">
              <option value="2021-2022">2021-2022</option>
              <option value="2022-2023">2022-2023</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentByCourse}>
              <XAxis dataKey="course" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#9b59b6" name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
