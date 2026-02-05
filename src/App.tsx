import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Screens/login";
import Employeedashboard from "./Screens/Employeedashboard";
import Managerdashboard from "./Screens/Managerdashboard";
import ProtectedRoute from "./Routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import MainLayout from "./layout/Mainlayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/manager"
          element={
            <ProtectedRoute role="MANAGER">
              <MainLayout>
                <Managerdashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee"
          element={
            <ProtectedRoute role="EMPLOYEE">
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
