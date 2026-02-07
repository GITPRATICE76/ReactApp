import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
} from "react-icons/fi";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("Dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside
      className={`${
        open ? "w-60" : "w-20"
      } h-screen bg-white border-r transition-all duration-300 flex flex-col`}
    >
      {/* Top */}
      <div className="flex items-center justify-between px-4 h-16 border-b">
        <span className="font-bold text-indigo-600 text-lg">
          {open ? "Craft Silicon" : "CS"}
        </span>
        <button onClick={() => setOpen(!open)}>
          {open ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
      </div>

      {/* Team Card */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg">
          {/* <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
            T
          </div> */}
          {open && (
            <div>
              <p className="text-sm font-semibold">Team Engineering</p>
              <p className="text-xs text-gray-500">40 Members</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 space-y-1">
        <MenuItem
          icon={<FiHome />}
          label="Dashboard"
          open={open}
          active={active === "Dashboard"}
          onClick={() => {
            setActive("Dashboard");

            const role = localStorage.getItem("role");

            if (role === "EMPLOYEE") {
              navigate("/employee");
            } else {
              navigate("/manager");
            }
          }}
        />

        <MenuItem
          icon={<FiUsers />}
          label="Leave Requests"
          open={open}
          active={active === "Leave Requests"}
          onClick={() => {
            setActive("Leave Requests");
            navigate("/manager/leave-requests");
          }}
        />
        <MenuItem
          icon={<FiUsers />}
          label="Organization Chart"
          open={open}
          active={active === "Organization Chart"}
          onClick={() => {
            setActive("Organization Chart");
            navigate("/manager/org-chart");
          }}
        />
        <MenuItem
          icon={<FiCalendar />}
          label="Apply Leave"
          open={open}
          active={active === "Apply Leave"}
          onClick={() => {
            setActive("Apply Leave");
            navigate("/employee/apply-leave");
          }}
        />
      </nav>

      {/* Logout */}
      <div className="p-3">
        <button
          onClick={handleLogout}
          className="flex bg-red-100 items-center gap-3 w-full text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg text-sm"
        >
          <FiLogOut />
          {open && "Logout"}
        </button>
      </div>
    </aside>
  );
}

function MenuItem({ icon, label, open, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm
        ${
          active
            ? "bg-indigo-100 text-indigo-600 font-semibold"
            : "text-gray-600 hover:bg-slate-100"
        }`}
    >
      <span className="text-lg">{icon}</span>
      {open && label}
    </button>
  );
}
