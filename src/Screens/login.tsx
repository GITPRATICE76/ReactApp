import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Lottie from "lottie-react";
import animationData from "../assets/Login.json";
import { toast } from "react-toastify";
import axiosInstance from "../Routes/axiosInstance";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL } from "../services/userapi.service";
import companyLogo from "../assets/craftsiliconlogo-removebg-preview.png";
import Logo from "../assets/ChatGPT_Image_Feb_16__2026__09_53_46_AM-removebg-preview.png";
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
  const versionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        versionRef.current &&
        !versionRef.current.contains(event.target as Node)
      ) {
        setShowVersion(false);
      }
    }

    if (showVersion) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showVersion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post(LOGIN_URL, { email, password });
      const { token } = res.data;

      localStorage.setItem("token", token);

      const decoded: MyToken = jwtDecode(token);

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
  <div className="h-screen w-screen flex">

    {/* LEFT PANEL */}
    <div className="hidden md:flex w-1/2 h-full flex-col justify-center items-center bg-gradient-to-br from-blue-900 to-blue-700 text-white px-16">
      
      <img
        src={companyLogo}
        alt="Company Logo"
        className="w-40 mb-10"
      />

      <Lottie
        animationData={animationData}
        loop={true}
        className="w-96"
      />

      <h2 className="text-3xl font-semibold mt-10">
        Leave Management System
      </h2>
      <p className="text-base text-white/80 mt-4 text-center max-w-md">
        Streamline employee leave tracking and approvals efficiently.
      </p>
    </div>

    {/* RIGHT PANEL */}
    <div className="w-full md:w-1/2 h-full flex items-center justify-center bg-gray-50 px-10 relative">
      
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <img
            src={Logo}
            alt="App Logo"
            className="w-28 mx-auto mb-6"
          />
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Please login to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">
              Email Address
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-2 h-12"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">
              Password
            </label>
            <div className="relative mt-2">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-12 pr-10"
                required
              />
              <i
                className={`absolute right-3 top-4 cursor-pointer text-gray-500 ${
                  showPassword ? "ri-eye-line" : "ri-eye-off-line"
                }`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-lg bg-blue-900 hover:bg-blue-800 text-base"
          >
            Login
          </Button>

          <p className="text-sm text-center text-gray-500">
            Don’t have an account?{" "}
            <span
              className="text-blue-900 font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/create-employee")}
            >
              Create account
            </span>
          </p>
        </form>
      </div>

      {/* Bottom Right Version */}
      <div className="absolute bottom-6 right-8 text-sm text-gray-500 flex gap-4">
        <span>Version 1.0</span>
        <button
          className="text-blue-900 hover:underline"
          onClick={() => setShowVersion(!showVersion)}
        >
          About
        </button>
      </div>

      {showVersion && (
        <div
          ref={versionRef}
          className="absolute bottom-16 right-8 bg-white border rounded-lg shadow-lg px-4 py-3 text-gray-700"
        >
          <p className="text-sm font-semibold">Application Version</p>
          <p className="text-sm">1.0.0</p>
        </div>
      )}
    </div>
  </div>
);

}
