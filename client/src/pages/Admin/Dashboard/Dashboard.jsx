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

const studentByYearAndSem = [
  { year: "2021-2022", sem1: 200, sem2: 180 },
  { year: "2022-2023", sem1: 220, sem2: 210 },
  { year: "2023-2024", sem1: 250, sem2: 230 },
  { year: "2024-2025", sem1: 240, sem2: 220 },
];

// Fake Data for Charts
const passFailData = [
  { name: "Passed", value: 80 },
  { name: "Failed", value: 20 },
];

const COLORS = ["#4CAF50", "#FF5252"]; // Green for pass, Red for fail

const Dashboard = () => {
  return (
    <div className="w-full">
      {" "}
      <div className=" flex flex-wrap">
        <Cards data={cardData} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Pass vs. Fail Chart */}
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
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-center text-xl font-semibold mb-3">
            Student Enrollment by School Year & Semester
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentByYearAndSem}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sem1" fill="#3498db" name="Semester 1" />
              <Bar dataKey="sem2" fill="#e74c3c" name="Semester 2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
