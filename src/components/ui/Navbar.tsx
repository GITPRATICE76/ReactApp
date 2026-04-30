import { jwtDecode } from "jwt-decode";
import companyLogo from "../../assets/ChatGPT_Image_Feb_16__2026__09_53_46_AM-removebg-preview.png";
import { FiCalendar, FiUser } from "react-icons/fi";

interface MyToken {
  id: number;
  name: string;
  role: string;
  exp: number;
}

export default function Navbar() {
  const token = localStorage.getItem("token");
  let username = "";

  if (token) {
    try {
      const decoded = jwtDecode<MyToken>(token);
      username = decoded.name;
    } catch {
      username = "";
    }
  }

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Left: User Welcome */}
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
          <FiUser size={18} />
        </div>
        <div className="flex flex-col">
         
          <span className="text-sm font-bold text-slate-800 leading-none">
            Welcome{username ? `, ${username}` : " back"}!
          </span>
        </div>
      </div>

      {/* Right: Date & Branding */}
      <div className="flex items-center gap-8">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100/50">
          <FiCalendar size={14} className="text-slate-400" />
          <span className="text-xs font-black text-slate-600 uppercase tracking-tight">
            {today}
          </span>
        </div>

        {/* Company Logo Area */}
        <div className="flex items-center pl-6 border-l border-slate-100">
          <img
            src={companyLogo}
            alt="Company Logo"
            className="h-20 w-auto object-contain brightness-110"
          />
        </div>
      </div>
    </header>
  );
}