import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Lottie from "lottie-react";
import animationData from "../assets/Login.json";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { toast } from "react-toastify";
import axiosInstance from "../Routes/axiosInstance";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL } from "../services/userapi.service";
import companyLogo from "../assets/craftsiliconlogo-removebg-preview.png";

import { jwtDecode } from "jwt-decode";

interface MyToken {
  id: number;
  name: string;
  role: string;
  department: string;
  exp: number;
  team?: string;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVersion, setShowVersion] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post(LOGIN_URL, { email, password });
      const { token } = res.data;

      // ✅ Store token
      localStorage.setItem("token", token);

      // ✅ Decode token
      const decoded: any = jwtDecode(token);

      // ✅ Store decoded values
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("username", decoded.name);
      localStorage.setItem("userid", decoded.id.toString());
      localStorage.setItem("team", decoded.team ?? "");

      toast.success("Logged in successfully");

      if (decoded.role === "MANAGER" || decoded.role === "RO") {
        navigate("/manager");
      } else {
        navigate("/employee");
      }
    } catch (error) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-12 px-6 items-center">
        {/* Animation Section */}
        <div className="hidden md:flex flex-col items-center justify-center text-white">
          <div className="h-90 backdrop-blur-md flex items-center justify-center overflow-hidden">
            <Lottie
              animationData={animationData}
              loop={true}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-md mx-auto shadow-none border-0 bg-transparent rounded-2xl">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div style={styles.company}>
                <img
                  src={companyLogo}
                  alt="Company Logo"
                  style={styles.companyImage1}
                />
              </div>

              {/* USERNAME */}
              <div className="bg-white h-12 rounded-xl flex items-center px-4 shadow-sm">
                <i className="ri-user-line text-blue-600 text-lg mr-3"></i>

                <Input
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-700 px-1 placeholder:text-gray-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EMAILID"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="bg-white h-12 rounded-xl flex items-center px-4 shadow-sm">
                <i className="ri-lock-2-line text-blue-600 text-lg mr-3"></i>

                <Input
                  type={showPassword ? "text" : "password"}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-700 placeholder:text-gray-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="PASSWORD"
                  required
                />

                <i
                  className={`text-blue-600 text-lg cursor-pointer ${
                    showPassword ? "ri-eye-line" : "ri-eye-off-line"
                  }`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-950 to-blue-900 hover:from-blue-900 hover:to-blue-700"
              >
                LOGIN
              </Button>

              <p className="text-sm text-center text-white/80">
                Don’t have an account?{" "}
                <span
                  className="text-white font-bold cursor-pointer hover:underline"
                  onClick={() => navigate("/create-employee")}
                >
                  Create account
                </span>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>

      <div className="absolute bottom-0 w-full bg-gradient-to-r from-blue-950 to-blue-900 text-white h-12 flex items-center justify-between px-6 text-sm">
        <div style={styles.company}>
          <img
            src={companyLogo}
            alt="Company Logo"
            style={styles.companyImage}
          />
        </div>
        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-blue-300"
            onClick={() => setShowVersion(!showVersion)}
          >
            <i className="ri-information-line"></i>
            <span>About</span>
          </div>

          {showVersion && (
            <div className="absolute bottom-10 right-0  text-gray-800 rounded-xl shadow-lg px-4 py-3 w-20 animate-in fade-in zoom-in">
              <p className="text-sm font-semibold">Version</p>
              <p className="text-sm font-bold">1.0</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
const styles: { [key: string]: React.CSSProperties } = {
  companyImage: {
    height: "80px",
    width: "100px",
    filter: "brightness(0) invert(1)",
    marginRight: "20px",
  },

  company: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  companyImage1: {
    height: "115px",
    width: "152px",
    margin: " 2px 11px 4px 121px",
  },
};
