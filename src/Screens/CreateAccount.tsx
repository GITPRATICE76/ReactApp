import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import axiosInstance from "../Routes/axiosInstance";
import { toast } from "react-toastify";
import { CREATEACCOUNT_URL } from "../services/userapi.service";
import { useEffect } from "react";

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  department?: string;
  team?: string;
};

export default function CreateAccount({ onClose }: { onClose?: () => void }) {
  const [user, setUser] = useState<any>(null);
  const [teamOptions, setTeamOptions] = useState<string[]>([]);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  // const [password, setPassword] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [team, setTeam] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userid");

        console.log("UserId:", userId); // ✅ should be 40

        const res = await axiosInstance.get(`/me?user_id=${userId}`);

        console.log("API Response:", res);
        console.log("API Data:", res.data);

        setUser(res.data);
      } catch (error) {
        console.error("ERROR:", error);
      }
    };

    fetchUser();
  }, []);

  const fetchTeams = async (dept: string) => {
    try {
      const res = await axiosInstance.get(`/usercode/details?masterId=${dept}`);
      console.log("dept value:", dept);

      const teams = res.data.map((item: any) => item.code);
      setTeamOptions(teams);
    } catch (err) {
      console.error("Team fetch failed", err);
    }
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

  const getDepartments = () => {
    if (!user) return [];

    return user.department ? [user.department] : [];
  };
  const handleCreateEmployee = async () => {
    const fields: (keyof Errors)[] = ["name", "email", "department", "team"];
    const values = [name, email, department, team];

    const results = fields.map((f, i) => validateField(f, values[i]));
    if (results.includes(false)) return;

    const payload = { name, email, department, team };

    try {
      await axiosInstance.post(CREATEACCOUNT_URL, payload);

      toast.success("Employee created!");
      if (onClose) {
        onClose();
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
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      {/* MODAL BOX */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        {/* CLOSE BUTTON */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        )}

        <div className="space-y-6">
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

          {/* DEPARTMENT + TEAM (UNCHANGED LOGIC) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Department</Label>
              <select
                className="w-full border rounded-lg h-12 mt-2 px-3 bg-white focus:ring-2 focus:ring-indigo-600"
                value={department}
                onChange={(e) => {
                  const value = e.target.value;

                  setDepartment(value);

                  setTeam("");

                  fetchTeams(value);

                  validateField("department", value);
                }}
              >
                <option value="">Select</option>
                {getDepartments().map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
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
                {teamOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PASSWORD */}
          {/* <div>
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
          </div> */}

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
