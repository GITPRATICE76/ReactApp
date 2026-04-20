import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Screens/login";
import Employeedashboard from "./Screens/Employeedashboard";
import Managerdashboard from "./Screens/Managerdashboard";
import ProtectedRoute from "./Routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import MainLayout from "./layout/Mainlayout";
import CreateAccount from "./Screens/CreateAccount";
import OrganizationChart from "./Screens/OrganizationChart";
import EmployeeLeaveApply from "./Screens/EmployeeLeaveApply";
import LeaveCalendar from "./Screens/CalenderScreen";
import LeaveHistory from "./components/LeaveHistory";
import Rodashboard from "./Screens/RoDashboard";
import Managerleavetrack from "./Screens/Managerleavetrack";

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
        <Route
          path="/manager/managerleavetrack"
          element={
            <ProtectedRoute roles={["MANAGER"]}>
              <MainLayout>
                <Managerleavetrack />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* LEAVE REQUESTS */}
        <Route
          path="/manager/leave-history"
          element={
            <ProtectedRoute roles={["MANAGER", "RO"]}>
              <MainLayout>
                <LeaveHistory />
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
                <OrganizationChart />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* EMPLOYEE */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute roles={["EMPLOYEE", "RO"]}>
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
          path="/manager/calender"
          element={
            <ProtectedRoute roles={["MANAGER", "RO"]}>
              <MainLayout>
                <LeaveCalendar />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/apply-leave"
          element={
            <ProtectedRoute roles={["EMPLOYEE", "RO", "MANAGER"]}>
              <MainLayout>
                <EmployeeLeaveApply />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ro/ro_dashboard"
          element={
            <ProtectedRoute roles={["RO"]}>
              <MainLayout>
                <Rodashboard />
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
