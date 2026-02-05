import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <>
      <style>{styles}</style>

      <aside className={`sidebar ${open ? "open" : "closed"}`}>
        <div className="toggle-btn" onClick={() => setOpen(!open)}>
          {open ? "⬅" : "➡"}
        </div>

        <div className="logo">{open ? "Craft Silicon" : "CS"}</div>

        <div className="company-card">
          <div className="company-logo">T</div>
          {open && (
            <div>
              <div className="company-name">Team Engineering</div>
              <div className="company-meta">Team - 40 Members</div>
            </div>
          )}
        </div>

        <div className="section">
          {open && <div className="section-header">MAIN MENU</div>}
          <MenuItem label={open ? "Dashboard" : ""} icon="📊" />
          <MenuItem label={open ? "Employee" : ""} icon="👥" />
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          {open ? "Logout" : "🚪"}
        </button>
      </aside>
    </>
  );
}

function MenuItem({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="menu-item">
      <span className="icon">{icon}</span>
      {label && <span>{label}</span>}
    </div>
  );
}

const styles = `
.sidebar {
  width: 270px;
  background: #ffffff;
  border-right: 1px solid #eee;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  transition: width 0.3s ease;
  position: relative;
}

.sidebar.closed {
  width: 80px;
}

.toggle-btn {
  position: absolute;
  top: 12px;
  right: -12px;
  background: #4f46e5;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
}

.logo {
  font-size: 20px;
  font-weight: 700;
}

.company-card {
  display: flex;
  gap: 12px;
  align-items: center;
  background: #f7f9fc;
  padding: 12px;
  border-radius: 12px;
}

.company-logo {
  width: 40px;
  height: 40px;
  background: #111827;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-weight: bold;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-header {
  font-size: 12px;
  font-weight: 600;
  color: #9aa4b2;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
}

.menu-item:hover {
  background: #f1f5ff;
}

.icon {
  font-size: 18px;
}

.logout-btn {
  margin-top: auto;
  height: 44px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(to right, #ef4444, #dc2626);
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.sidebar.closed .company-name,
.sidebar.closed .company-meta,
.sidebar.closed .section-header,
.sidebar.closed .menu-item span:last-child {
  display: none;
}
`;
