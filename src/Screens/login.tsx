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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL } from "../services/userapi.service";
 
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
 
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
 
  //   const res = await axios.get(LOGIN_URL);
 
  //   const users = res.data.users;
 
  //   const user = users.find(
  //     (u: any) => u.email === email && u.password === password,
  //   );
 
  //   if (!user) {
  //     toast.error("Invalid credentials");
  //     return;
  //   }
 
  //   localStorage.setItem("isLoggedIn", "true");
 
  //   localStorage.setItem("role", user.role);
  //   localStorage.setItem("username", user.name);
 
  //   if (user.role === "MANAGER") {
  //     navigate("/manager");
  //     toast.success("LoggedIn Successfully");
  //   } else {
  //     navigate("/employee");
  //     toast.success("LoggedIn Successfully");
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
    try {
      const res = await axios.post(LOGIN_URL, { email, password });
 
      const user = res.data;
 
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", user.role);
      localStorage.setItem("username", user.name);
 
     
 switch (user.role) {
  case "MANAGER":
    navigate("/manager");
     toast.success("Logged in successfully");
    break;
  case "RO":
    navigate("/manager");
    toast.success("Logged in successfully");
    break;
  default:
    navigate("/employee");
}

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    }
  };
 
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
 
      <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-12 px-6 items-center">
        <div className="hidden md:flex flex-col items-center justify-center text-white">
          <div className=" h-90 backdrop-blur-md flex items-center justify-center overflow-hidden">
            <Lottie
              animationData={animationData}
              loop={true}
              className="w-full h-full"
            />
          </div>
        </div>
 
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
                />
              </div>
 
              <div className="space-y-1">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
 
 