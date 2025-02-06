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

import CityAdmin from "./pages/Admin/UserManagement/CityAdmin/CityAdmin";
import SlaughterhouseUser from "./pages/Admin/UserManagement/Slaughterhouse/SlaughterhouseUsers";
import TransactionDetails from "./pages/Shared/TransactionDetails";
function App() {
  const adminLinks = [
    {
      title: "Dashboard",
      path: "/city-treasurer-dashboard",
      component: <Dashboard />,
    },
    { title: "City Admin", path: "/city-treasurer", component: <CityAdmin /> },
    {
      title: "Slaughterhouse User",
      path: "/slaughterhouse-admin",
      component: <SlaughterhouseUser />,
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
    {
      title: "Transaction",
      path: "/transaction/:id",
      component: <TransactionDetails />,
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
