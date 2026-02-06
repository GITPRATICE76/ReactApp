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
import { UserPlus, Mail, Lock, Building2, Users } from "lucide-react"; // Icons for a better look

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

  const handleCreateEmployee = async () => {
    const fields: (keyof Errors)[] = ["name", "email", "password", "department", "team"];
    const values = [name, email, password, department, team];
    
    const results = fields.map((f, i) => validateField(f, values[i]));
    if (results.includes(false)) return;

    const payload = { name, email, password, department, team };

    try {
      const response = await fetch(CREATEACCOUNT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 409) {
        setErrors((prev) => ({ ...prev, email: "Email already exists" }));
        return;
      }

      if (!response.ok) throw new Error();
      toast.success("Employee created!");
      navigate("/");
    } catch {
      toast.error("Network error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      {/* Decorative background elements like the Org Chart dots */}
      <div className="fixed inset-0 pointer-events-none opacity-40" 
           style={{ backgroundImage: 'radial-gradient(#e5e7eb 1.5px, transparent 0)', backgroundSize: '24px 24px' }}>
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl rounded-[24px] bg-white relative z-10 overflow-hidden">
        <div className="h-2 bg-indigo-600 w-full" /> {/* Top accent line */}
        
        <CardHeader className="space-y-1 pt-8">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-2">
            <UserPlus className="text-indigo-600" size={24} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Create Employee</CardTitle>
          <CardDescription className="text-slate-500 font-medium">Add a new member to the organization</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Name Field */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Mail size={14} /> Full Name
            </Label>
            <Input
              placeholder="e.g. Leslie Alexander"
              className={`rounded-xl border-slate-200 focus:ring-indigo-500 ${errors.name ? 'border-red-400' : ''}`}
              value={name}
              onChange={(e) => { setName(e.target.value); validateField("name", e.target.value); }}
            />
            {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Mail size={14} /> Work Email
            </Label>
            <Input
              type="email"
              placeholder="leslie@company.com"
              className={`rounded-xl border-slate-200 focus:ring-indigo-500 ${errors.email ? 'border-red-400' : ''}`}
              value={email}
              onChange={(e) => { setEmail(e.target.value); validateField("email", e.target.value); }}
            />
            {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.email}</p>}
          </div>

          {/* Department & Team (Grid Layout) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Building2 size={14} /> Dept
              </Label>
              <select
                className="w-full border border-slate-200 rounded-xl p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setTeam("");
                  validateField("department", e.target.value);
                }}
              >
                <option value="">Select...</option>
                <option value="QA">QA</option>
                <option value="DEVELOPMENT">Development</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Users size={14} /> Team
              </Label>
              <select
                className="w-full border border-slate-200 rounded-xl p-2 text-sm bg-white disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={team}
                onChange={(e) => { setTeam(e.target.value); validateField("team", e.target.value); }}
                disabled={!department}
              >
                <option value="">Select...</option>
                {getTeams().map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Lock size={14} /> Password
            </Label>
            <Input
              type="password"
              placeholder="••••••••"
              className={`rounded-xl border-slate-200 focus:ring-indigo-500 ${errors.password ? 'border-red-400' : ''}`}
              value={password}
              onChange={(e) => { setPassword(e.target.value); validateField("password", e.target.value); }}
            />
            {errors.password && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.password}</p>}
          </div>
        </CardContent>

        <CardFooter className="pb-8 pt-4">
          <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-6 font-bold text-base shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
            onClick={handleCreateEmployee}
          >
            Confirm Registration
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}