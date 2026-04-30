import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiEdit3,
  FiFileText,
} from "react-icons/fi";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../Routes/axiosInstance";
import CreateAccount from "../../Screens/CreateAccount";

interface MyToken {
  id: number;
  name: string;
  role: "MANAGER" | "EMPLOYEE" | "RO";
  department: string;
  exp: number;
}

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [memberCount, setMemberCount] = useState(0);
  const [teamName, setTeamName] = useState("");
  const [role, setRole] = useState<MyToken["role"] | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode<MyToken>(token);
      setRole(decoded.role);
      setTeamName(decoded.department);
    } catch (error) {
      console.error("Invalid token");
    }
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!teamName) return;
      try {
        const res = await axiosInstance.get("/org-chart");
        const count = res.data.filter(
          (user: any) => user.department === teamName,
        ).length;
        setMemberCount(count);
      } catch (error) {
        console.error("Failed to load members", error);
      }
    };
    fetchMembers();
  }, [teamName]);

  const confirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside
      className={`${open ? "w-52" : "w-16"} h-screen bg-white border-r transition-all duration-300 flex flex-col shadow-sm`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b bg-slate-50/50">
        <span className="font-black text-indigo-600 text-xl tracking-tight">
          {open ? "Craft Silicon" : "CS"}
        </span>
        <button
          onClick={() => setOpen(!open)}
          className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors text-slate-500"
        >
          {open ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
        </button>
      </div>

      {/* Team Card Section */}
      <div className="px-3 py-4">
        <div
          className={`flex items-center gap-3 ${open ? "bg-indigo-50/50" : "justify-center"} p-3 rounded-xl border border-indigo-100/50`}
        >
          <div className="min-w-[32px] h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-100">
            {teamName ? teamName.charAt(0) : "T"}
          </div>
          {open && (
            <div className="overflow-hidden">
              {/* <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Your Department</p> */}
              <p className="text-sm font-bold text-slate-700 truncate leading-none">
                {teamName || "Team"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 space-y-1 pt-2 overflow-y-auto custom-scrollbar">
        <MenuItem
          icon={<FiHome />}
          label="Dashboard"
          open={open}
          active={
            location.pathname === "/manager" ||
            location.pathname === "/employee"
          }
          onClick={() =>
            navigate(role === "EMPLOYEE" ? "/employee" : "/manager")
          }
        />

        {role === "RO" && (
          <MenuItem
            icon={<FiFileText />}
            label="Self Dashboard"
            open={open}
            active={location.pathname === "/ro/ro_dashboard"}
            onClick={() => navigate("/ro/ro_dashboard")}
          />
        )}

        {role === "MANAGER" && (
          <MenuItem
            icon={<FiFileText />}
            label="Self Dashboard"
            open={open}
            active={location.pathname === "/manager/managerleavetrack"}
            onClick={() => navigate("/manager/managerleavetrack")}
          />
        )}

        <MenuItem
          icon={<FiEdit3 />}
          label="Apply Leave"
          open={open}
          active={location.pathname === "/employee/apply-leave"}
          onClick={() => navigate("/employee/apply-leave")}
        />

        {role === "MANAGER" && (
          <MenuItem
            icon={<FiFileText />}
            label="Leave History"
            open={open}
            active={location.pathname === "/manager/leave-history"}
            onClick={() => navigate("/manager/leave-history")}
          />
        )}

        <MenuItem
          icon={<FiCalendar />}
          label="Calendar View"
          open={open}
          active={location.pathname.includes("calender")}
          onClick={() =>
            navigate(
              role === "EMPLOYEE" ? "/employee/calender" : "/manager/calender",
            )
          }
        />

        {role === "MANAGER" && (
          <MenuItem
            icon={<FiUsers />}
            label="Organization Chart"
            open={open}
            active={location.pathname.includes("org-chart")}
            onClick={() => navigate("/manager/org-chart")}
          />
        )}
      </nav>

      {/* --- KEPT AS REQUESTED: CREATE ACCOUNT BUTTON --- */}
      {(role === "MANAGER" || role === "RO") && (
        <div className="py-2">
          <p className="text-sm text-center text-gray-500">
            <span
              className="text-blue-900 font-medium cursor-pointer hover:underline"
              onClick={() => setShowCreateModal(true)}
            >
              CREATE ACCOUNT
            </span>
          </p>
        </div>
      )}

      {/* Logout Button */}
      <div className="p-4 mt-2 border-t bg-slate-50/30">
        <button
          onClick={() => setShowLogoutModal(true)}
          className={`flex items-center gap-3 w-full text-rose-600 font-bold hover:bg-rose-50 px-4 py-2.5 rounded-xl text-sm transition-all active:scale-95`}
        >
          <FiLogOut size={18} />
          {open && "Logout"}
        </button>
      </div>

      {/* Modals */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLogOut size={30} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Are you sure?
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              You will need to login again to access your dashboard.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-100"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative border flex flex-col">
            <div className="p-4 border-b flex justify-between items-center px-6 bg-slate-50/50">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Employee Registration
              </span>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <CreateAccount onClose={() => setShowCreateModal(false)} />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function MenuItem({ icon, label, open, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm transition-all duration-200
        ${active ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-100" : "text-slate-600 hover:bg-slate-100"}`}
    >
      <span className={`text-lg ${active ? "text-white" : "text-slate-400"}`}>
        {icon}
      </span>
      {open && <span className="truncate tracking-tight">{label}</span>}
    </button>
  );
}
