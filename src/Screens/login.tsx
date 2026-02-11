import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Lottie from "lottie-react";
import animationData from "../assets/Login.json";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { toast } from "react-toastify";
import axiosInstance from "../Routes/axiosInstance";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL } from "../services/userapi.service";
import { jwtDecode } from "jwt-decode";

interface MyToken {
  id: number;
  name: string;
  role: string;
  department: string;
  exp: number;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     const res = await axios.post(LOGIN_URL, { email, password });

  //     const { token } = res.data;

  //     // ✅ Store only token
  //     localStorage.setItem("token", token);

  //     // ✅ Decode token
  //     const decoded = jwtDecode<MyToken>(token);

  //     toast.success("Logged in successfully");

  //     // ✅ Navigate based on role
  //     if (decoded.role === "MANAGER" || decoded.role === "RO") {
  //       navigate("/manager");
  //     } else {
  //       navigate("/employee");
  //     }
  //   } catch (error: any) {
  //     toast.error("Invalid credentials");
  //   }
  // };
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     const res = await axiosInstance.post(LOGIN_URL, { email, password });

  //     const { token } = res.data;

  //     localStorage.setItem("token", token);

  //     const decoded: any = jwtDecode(token);

  //     console.log("Decoded Token:", decoded);

  //     toast.success("Logged in successfully");

  //     console.log("Role is:", decoded.role);

  //     if (decoded.role === "MANAGER" || decoded.role === "RO") {
  //       console.log("Navigating to manager");
  //       navigate("/manager");
  //     } else {
  //       console.log("Navigating to employee");

  //       navigate("/employee");
  //     }
  //   } catch (error) {
  //     toast.error("Invalid credentials");
  //   }
  // };
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
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="text-right text-sm text-blue-600 cursor-pointer">
                Forgot password?
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full h-11 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Login
              </Button>

              <p className="text-sm text-center text-gray-600">
                Don’t have an account?{" "}
                <span
                  className="text-blue-600 font-medium cursor-pointer"
                  onClick={() => navigate("/create-employee")}
                >
                  Create account
                </span>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
