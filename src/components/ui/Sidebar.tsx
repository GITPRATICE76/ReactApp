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

  /* ================= DECODE TOKEN SAFELY ================= */

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

  /* ================= FETCH MEMBER COUNT ================= */

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
          {open && (
            <div>
              <p className="text-sm font-semibold">{teamName || "Team"}</p>
              <p className="text-xs text-gray-500">{memberCount} Members</p>
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
          active={
            location.pathname === "/manager" ||
            location.pathname === "/employee"
          }
          onClick={() => {
            if (role === "EMPLOYEE") {
              navigate("/employee");
            } else {
              navigate("/manager");
            }
          }}
        />
        {role === "RO" && (
  <MenuItem
    icon={<FiHome />}
    label="RO Dashboard"
    open={open}
    active={location.pathname === "/employee"}
    onClick={() => navigate("/employee")}
  />
)}
        {role === "EMPLOYEE" && (
          <MenuItem
            icon={<FiEdit3 />}
            label="Apply Leave"
            open={open}
            active={location.pathname === "/employee/apply-leave"}
            onClick={() => navigate("/employee/apply-leave")}
          />
        )}
        {role === "RO" && (
          <MenuItem
            icon={<FiEdit3 />}
            label="Apply Leave"
            open={open}
            active={location.pathname === "/employee/apply-leave"}
            onClick={() => navigate("/employee/apply-leave")}
          />
        )}

        {role === "EMPLOYEE" && (
          <MenuItem
            icon={<FiCalendar />}
            label="Calender View"
            open={open}
            active={location.pathname === "/employee/calender"}
            onClick={() => navigate("/employee/calender")}
          />
        )}
        {role === "RO" && (
          <MenuItem
            icon={<FiCalendar />}
            label="Calender View"
            open={open}
            active={location.pathname === "/employee/calender"}
            onClick={() => navigate("/employee/calender")}
          />
        )}

        {role === "MANAGER" && (
          <MenuItem
            icon={<FiFileText />}
            label="Leave History"
            open={open}
            active={location.pathname === "/manager/leave-history"}
            onClick={() => navigate("/manager/leave-history")}
          />
        )}
        {role === "MANAGER" && (
          <MenuItem
            icon={<FiCalendar />}
            label="Calender View"
            open={open}
            active={location.pathname === "/manager/calender"}
            onClick={() => navigate("/manager/calender")}
          />
        )}

        {role === "MANAGER" && (
          <MenuItem
            icon={<FiUsers />}
            label="Organization Chart"
            open={open}
            active={
              location.pathname === "/manager/org-chart" ||
              location.pathname === "/ro/org-chart"
            }
            onClick={() => {
              {
                navigate("/manager/org-chart");
              }
            }}
          />
        )}
      </nav>
      {(role === "MANAGER" || role === "RO") && (
        <p className="text-sm text-center text-gray-500">
          <span
            className="text-blue-900 font-medium cursor-pointer hover:underline"
            onClick={() => setShowCreateModal(true)}
          >
            CREATE ACCOUNT
          </span>
        </p>
      )}

      <div className="p-3">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 w-full text-red-500 bg-red-100 hover:bg-red-50 px-3 py-2 rounded-lg text-sm"
        >
          <FiLogOut />
          {open && "Logout"}
        </button>
      </div>
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to logout?
            </h2>

            <div className="flex justify-center gap-4">
              {/* Yes */}
              <button
                onClick={confirmLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes
              </button>

              {/* No */}
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-1 right-1 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <CreateAccount onClose={() => setShowCreateModal(false)} />
          </div>
        </div>
      )}
    </aside>
  );
}

/* ================= MENU ITEM ================= */

function MenuItem({
  icon,
  label,
  open,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-all duration-200
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
