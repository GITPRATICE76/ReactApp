import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { toast } from "react-toastify";
import { CREATEACCOUNT_URL } from "../services/userapi.service";
import { useNavigate } from "react-router-dom";

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  department?: string;
  team?: string;
};

export default function CreateAccount() {
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [team, setTeam] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  const getTeams = () => {
    if (department === "QA") return ["QA"];
    if (department === "DEVELOPMENT") return ["REACT", "BACKEND", "WEB", "DB"];
    return [];
  };

  const validateField = (field: keyof Errors, value: string) => {
    let message = "";

    if (!value) message = "This field is required";

    if (field === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) message = "Invalid email format";
    }

    if (field === "password" && value.length < 6) {
      message = "Password must be at least 6 characters";
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
    return !message;
  };

  const handleCreateEmployee = async () => {
    const isValid =
      validateField("name", name) &&
      validateField("email", email) &&
      validateField("password", password) &&
      validateField("department", department) &&
      validateField("team", team);

    if (!isValid) return;

    const payload = { name, email, password, department, team };

    try {
      const response = await fetch(CREATEACCOUNT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 409) {
        setErrors((prev) => ({
          ...prev,
          email: "Email already exists",
        }));
        return;
      }

      if (!response.ok) throw new Error();

      toast.success("Registered successfully");

      setName("");
      setEmail("");
      setPassword("");
      setDepartment("");
      setTeam("");
      setErrors({});
      navigate("/");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Employee</CardTitle>
          <CardDescription>Enter employee details</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                validateField("name", e.target.value);
              }}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField("email", e.target.value);
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validateField("password", e.target.value);
              }}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div>
            <Label>Department</Label>
            <select
              className="w-full border rounded-md p-2"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setTeam("");
                validateField("department", e.target.value);
              }}
            >
              <option value="">Select Department</option>
              <option value="QA">QA</option>
              <option value="DEVELOPMENT">Development</option>
            </select>
            {errors.department && (
              <p className="text-red-500 text-sm">{errors.department}</p>
            )}
          </div>

          <div>
            <Label>Team</Label>
            <select
              className="w-full border rounded-md p-2"
              value={team}
              onChange={(e) => {
                setTeam(e.target.value);
                validateField("team", e.target.value);
              }}
              disabled={!department}
            >
              <option value="">Select Team</option>
              {getTeams().map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.team && (
              <p className="text-red-500 text-sm">{errors.team}</p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={handleCreateEmployee}>
            Create Employee
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
