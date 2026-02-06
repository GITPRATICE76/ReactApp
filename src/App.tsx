import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Screens/login";
import Employeedashboard from "./Screens/Employeedashboard";
import Managerdashboard from "./Screens/Managerdashboard";
import ProtectedRoute from "./Routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import MainLayout from "./layout/Mainlayout";
import CreateAccount from "../src/Screens/CreateAccount";

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
