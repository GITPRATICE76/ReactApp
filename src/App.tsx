import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Screens/login";
import Employeedashboard from "./Screens/Employeedashboard";
import Managerdashboard from "./Screens/Managerdashboard";
import LeaveRequests from "../src/Screens/LeaveRequest";
// import OrganizationChart from "./Screens/OrganizationChart";
import ProtectedRoute from "./Routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import MainLayout from "./layout/Mainlayout";
import CreateAccount from "./Screens/CreateAccount";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-employee" element={<CreateAccount />} />

        {/* MANAGER DASHBOARD */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute roles={["MANAGER", "RO"]}>
              <MainLayout>
                <Managerdashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* LEAVE REQUESTS */}
        <Route
          path="/manager/leave-requests"
          element={
            <ProtectedRoute roles={["MANAGER", "RO"]}>
              <MainLayout>
                <LeaveRequests />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ✅ ORGANIZATION CHART */}
        {/* <Route
          path="/manager/org-chart"
          element={
            <ProtectedRoute roles={["MANAGER", "RO"]}>
              <MainLayout>
                <OrganizationChart />
              </MainLayout>
            </ProtectedRoute>
          }
        /> */}

        {/* EMPLOYEE */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute roles={["EMPLOYEE"]}>
              <MainLayout>
                <Employeedashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
