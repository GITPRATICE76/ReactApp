import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Screens/login";
import Employeedashboard from "./Screens/Employeedashboard";
import Managerdashboard from "./Screens/Managerdashboard";
import LeaveRequests from "../src/Screens/LeaveRequest";
import ProtectedRoute from "./Routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import MainLayout from "./layout/Mainlayout";
import CreateAccount from "./Screens/CreateAccount";
import OrganizationChart from "./Screens/OrganizationChart";
import EmployeeLeaveApply from "./Screens/EmployeeLeaveApply";
import ROOrganizationChart from "./Screens/ROOrganization";
import LeaveCalendar from "./Screens/CalenderScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-employee" element={<CreateAccount />} />

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
        <Route
          path="/manager/org-chart"
          element={
            <ProtectedRoute roles={["MANAGER"]}>
              <MainLayout>
                <OrganizationChart />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ro/org-chart"
          element={
            <ProtectedRoute roles={["RO"]}>
              <MainLayout>
                <ROOrganizationChart />
              </MainLayout>
            </ProtectedRoute>
          }
        />

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
        <Route
          path="/employee/calender"
          element={
            <ProtectedRoute roles={["EMPLOYEE"]}>
              <MainLayout>
                <LeaveCalendar />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/apply-leave"
          element={
            <ProtectedRoute roles={["EMPLOYEE"]}>
              <MainLayout>
                <EmployeeLeaveApply />
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
