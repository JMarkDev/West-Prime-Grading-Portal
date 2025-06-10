import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import rolesList from "./constants/rolesList";

import ProtectedRoute from "./route/ProtectedRoute";
import PageNotFound from "./pages/PageNotFound";

import UserProfile from "./pages/Shared/UserProfile";
import UserDetails from "./pages/Shared/UserDetails";

import Homepage from "./pages/Homepage";
import LayoutDashboard from "./components/layout/LayoutDashboard";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import Students from "../src/pages/Admin/Students/Students";
import Instructor from "./pages/Admin/Instructor/Instructor";
import Subjects from "./pages/Admin/Subjects/Subjects";
import Course from "./pages/Admin/Course/Course";
import SchoolYear from "./pages/Admin/SchoolYear/SchoolYear";
import Department from "./pages/Admin/Department/Department";
import Reports from "./pages/Admin/Reports/Reports";
import StudentDetails from "./pages/Admin/Students/StudentDetails";
import Admin from "./pages/Admin/Admin/Admin";
import StudentClass from "./pages/Admin/StudentClass/StudentClass";
import ClassDetails from "./pages/Admin/StudentClass/ViewClass";

import ViewGrade from "./pages/Student/ViewGrade";
import InstructorSubjects from "./pages/Instructor/InstructorSubjects";
import InputGrades from "./pages/Instructor/InputGrades";
import DeadlineSubmission from "./pages/Admin/DeadlineSubmission/DeadlineSubmission";

function App() {
  const adminLinks = [
    {
      title: "Dashboard",
      path: "/admin-dashboard",
      component: <Dashboard />,
    },
    {
      title: "Students",
      path: "/students",
      component: <Students />,
    },
    {
      title: "Class",
      path: "/class",
      component: <StudentClass />,
    },
    {
      title: "Class Details",
      path: "/class-details/:id",
      component: <ClassDetails />,
    },
    {
      title: "Student Details",
      path: "/student-details/:id",
      component: <StudentDetails />,
    },
    {
      title: "Instructor",
      path: "/instructors",
      component: <Instructor />,
    },
    {
      title: "Subjects",
      path: "/subjects",
      component: <Subjects />,
    },
    {
      title: "Course",
      path: "/courses",
      component: <Course />,
    },
    {
      title: "School Year",
      path: "/school-year",
      component: <SchoolYear />,
    },
    {
      title: "Departments",
      path: "/departments",
      component: <Department />,
    },
    {
      title: "Reports",
      path: "/reports",
      component: <Reports />,
    },
    {
      title: "Admin",
      path: "/admin",
      component: <Admin />,
    },
    {
      title: "Submission",
      path: "/deadline",
      component: <DeadlineSubmission />,
    },
  ];

  const sharedLinks = [
    {
      title: "User Profile",
      path: "/user-profile",
      component: <UserProfile />,
    },
    {
      title: "User Details",
      path: "/user-details/:id",
      component: <UserDetails />,
    },
  ];

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />

        {adminLinks.map((link, index) => (
          <Route
            key={index}
            path={link.path}
            element={
              <ProtectedRoute
                element={<LayoutDashboard>{link.component}</LayoutDashboard>}
                allowedRoles={[rolesList.admin]}
              />
            }
          />
        ))}
        <Route
          path="/view-grades"
          element={
            <ProtectedRoute
              element={<ViewGrade />}
              allowedRoles={[rolesList.student]}
            />
          }
        />

        <Route
          path="/instructor-dashboard"
          element={
            <ProtectedRoute
              element={<InstructorSubjects />}
              allowedRoles={[rolesList.instructor]}
            />
          }
        />

        <Route
          path="/input-grades"
          element={
            <ProtectedRoute
              element={<InputGrades />}
              allowedRoles={[rolesList.instructor]}
            />
          }
        />
        {sharedLinks.map((link, index) => (
          <Route
            key={index}
            path={link.path}
            element={
              <ProtectedRoute
                element={<LayoutDashboard>{link.component}</LayoutDashboard>}
                allowedRoles={[rolesList.admin, rolesList.supervisor]}
              />
            }
          />
        ))}

        {/* Not found page */}
        {/* <Route path="/scan-qr-code" element={<Scanner />} /> */}
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
