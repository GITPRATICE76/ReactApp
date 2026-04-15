import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import axiosInstance from "../Routes/axiosInstance";
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

export default function CreateAccount({ onClose }: { onClose?: () => void }) {
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
    if (!value) message = "Required";
    if (field === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) message = "Invalid email format";
    }
    if (field === "password" && value.length < 6) {
      message = "Min 6 characters";
    }
    setErrors((prev) => ({ ...prev, [field]: message }));
    return !message;
  };

  // const handleCreateEmployee = async () => {
  //   const fields: (keyof Errors)[] = ["name", "email", "password", "department", "team"];
  //   const values = [name, email, password, department, team];

  //   const results = fields.map((f, i) => validateField(f, values[i]));
  //   if (results.includes(false)) return;

  //   const payload = { name, email, password, department, team };

  //   try {
  //     const response = await  fetch(CREATEACCOUNT_URL, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     if (response.status === 409) {
  //       setErrors((prev) => ({ ...prev, email: "Email already exists" }));
  //       return;
  //     }

  //     if (!response.ok) throw new Error();
  //     toast.success("Employee created!");
  //     navigate("/");
  //   } catch {
  //     toast.error("Network error occurred");
  //   }
  // };
  const handleCreateEmployee = async () => {
    const fields: (keyof Errors)[] = [
      "name",
      "email",
      "password",
      "department",
      "team",
    ];
    const values = [name, email, password, department, team];

    const results = fields.map((f, i) => validateField(f, values[i]));
    if (results.includes(false)) return;

    const payload = { name, email, password, department, team };

    try {
      await axiosInstance.post(CREATEACCOUNT_URL, payload);

      toast.success("Employee created!");
      if (onClose) {
        onClose(); // close modal
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        setErrors((prev) => ({ ...prev, email: "Email already exists" }));
      } else {
        toast.error("Network error occurred");
      }
    }
  };

  return (
    <div className="p-6">
      {/* LEFT BRANDING PANEL */}

      {/* RIGHT FORM PANEL */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center bg-gray-50 px-10">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter employee details below
            </p>
          </div>

          {/* FULL NAME */}
          <div>
            <Label className="text-sm text-gray-600">Full Name</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                validateField("name", e.target.value);
              }}
              placeholder="Enter full name"
              className={`mt-2 h-12 ${errors.name ? "border-red-400" : ""}`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <Label className="text-sm text-gray-600">Work Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField("email", e.target.value);
              }}
              placeholder="Enter work email"
              className={`mt-2 h-12 ${errors.email ? "border-red-400" : ""}`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* DEPARTMENT + TEAM */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Department</Label>
              <select
                className="w-full border rounded-lg h-12 mt-2 px-3 bg-white focus:ring-2 focus:ring-indigo-600"
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setTeam("");
                  validateField("department", e.target.value);
                }}
              >
                <option value="">Select</option>
                <option value="QA">QA</option>
                <option value="DEVELOPMENT">Development</option>
              </select>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Team</Label>
              <select
                className="w-full border rounded-lg h-12 mt-2 px-3 bg-white disabled:bg-gray-100 focus:ring-2 focus:ring-indigo-600"
                value={team}
                disabled={!department}
                onChange={(e) => {
                  setTeam(e.target.value);
                  validateField("team", e.target.value);
                }}
              >
                <option value="">Select</option>
                {getTeams().map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <Label className="text-sm text-gray-600">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validateField("password", e.target.value);
              }}
              placeholder="Enter password"
              className={`mt-2 h-12 ${errors.password ? "border-red-400" : ""}`}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* BUTTON */}
          <Button
            onClick={handleCreateEmployee}
            className="w-full h-12 bg-indigo-900 hover:bg-indigo-800 text-white rounded-lg text-base"
          >
            Create Employee
          </Button>
        </div>
      </div>
    </div>
  );
}
