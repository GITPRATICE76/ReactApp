import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import axiosInstance from "../Routes/axiosInstance";
import { toast } from "react-toastify";
import { CREATEACCOUNT_URL } from "../services/userapi.service";
import { FiUser, FiMail, FiBriefcase, FiUsers } from "react-icons/fi";

type Errors = {
  name?: string;
  email?: string;
  department?: string;
  team?: string;
};

export default function CreateAccount({ onClose }: { onClose?: () => void }) {
  const [user, setUser] = useState<any>(null);
  const [teamOptions, setTeamOptions] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [team, setTeam] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userid");
        const res = await axiosInstance.get(`/me?user_id=${userId}`);
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
      const teams = res.data.map((item: any) => item.code);
      setTeamOptions(teams);
    } catch (err) {
      console.error("Team fetch failed", err);
    }
  };

  const validateField = (field: keyof Errors, value: string) => {
    let message = "";
    if (!value) message = "This field is required";
    if (field === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) message = "Invalid email format";
    }
    setErrors((prev) => ({ ...prev, [field]: message }));
    return !message;
  };

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
      toast.success("Employee created successfully!");
      if (onClose) onClose();
    } catch (error: any) {
      if (error.response?.status === 409) {
        setErrors((prev) => ({ ...prev, email: "Email already exists" }));
      } else {
        toast.error("Network error occurred");
      }
    }
  };

  return (
    <div className="bg-white p-8 md:p-10 w-full">
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
          <div className="w-2 h-6 bg-indigo-600 rounded-full" />
          Register Employee
        </h2>
        <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-wider">
          Add a new member to your department
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* FULL NAME */}
        <div className="space-y-2">
          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Full Name
          </Label>
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                validateField("name", e.target.value);
              }}
              placeholder="e.g. John Doe"
              className={`pl-11 h-12 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 transition-all ${
                errors.name ? "ring-2 ring-rose-500/20" : "focus:ring-indigo-500/20"
              }`}
            />
          </div>
          {errors.name && <p className="text-[10px] text-rose-500 font-bold uppercase ml-1">{errors.name}</p>}
        </div>

        {/* WORK EMAIL */}
        <div className="space-y-2">
          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Work Email
          </Label>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField("email", e.target.value);
              }}
              placeholder="john@craftsilicon.com"
              className={`pl-11 h-12 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 transition-all ${
                errors.email ? "ring-2 ring-rose-500/20" : "focus:ring-indigo-500/20"
              }`}
            />
          </div>
          {errors.email && <p className="text-[10px] text-rose-500 font-bold uppercase ml-1">{errors.email}</p>}
        </div>

        {/* DEPARTMENT */}
        <div className="space-y-2">
          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Department
          </Label>
          <div className="relative">
            <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 z-10" />
            <select
              className={`w-full pl-11 pr-4 bg-slate-50 border-none rounded-2xl h-12 text-sm font-bold text-slate-700 focus:ring-2 transition-all appearance-none relative ${
                errors.department ? "ring-2 ring-rose-500/20" : "focus:ring-indigo-500/20"
              }`}
              value={department}
              onChange={(e) => {
                const val = e.target.value;
                setDepartment(val);
                setTeam("");
                fetchTeams(val);
                validateField("department", val);
              }}
            >
              <option value="">Select Dept</option>
              {getDepartments().map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TEAM */}
        <div className="space-y-2">
          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Assigned Team
          </Label>
          <div className="relative">
            <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 z-10" />
            <select
              disabled={!department}
              className={`w-full pl-11 pr-4 bg-slate-50 border-none rounded-2xl h-12 text-sm font-bold text-slate-700 focus:ring-2 transition-all appearance-none disabled:opacity-50 ${
                errors.team ? "ring-2 ring-rose-500/20" : "focus:ring-indigo-500/20"
              }`}
              value={team}
              onChange={(e) => {
                setTeam(e.target.value);
                validateField("team", e.target.value);
              }}
            >
              <option value="">Select Team</option>
              {teamOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="mt-12 flex items-center justify-between border-t border-slate-50 pt-8">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[200px]">
          Credentials will be generated automatically upon creation.
        </p>
        <div className="flex gap-4">
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-3 text-sm font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-tight"
            >
              Cancel
            </button>
          )}
          <Button
            onClick={handleCreateEmployee}
            className="h-12 px-10 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-100"
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
}