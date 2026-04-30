import { useEffect, useState } from "react";
import axiosInstance from "../Routes/axiosInstance";
import { ORG_CHART_URL } from "../services/userapi.service";
import { FiUser, FiUserCheck, FiUsers, FiHexagon } from "react-icons/fi";

type OrgUser = {
  id: number;
  name: string;
  role: "MANAGER" | "RO" | "EMPLOYEE";
  department: string;
  team: string | null;
  reporting_to: number | null;
};

export default function OrganizationChart() {
  const [users, setUsers] = useState<OrgUser[]>([]);

  useEffect(() => {
    axiosInstance.get(ORG_CHART_URL).then((res) => {
      setUsers(Array.isArray(res.data) ? res.data : []);
    });
  }, []);

  // 1. Define the custom order for departments
  const deptOrder = ["DEVELOPMENT", "QA", "DEVOPS"];

  const managers = users.filter((u) => u.role === "MANAGER");
  
  // 2. Sort departments based on the defined order
  const departments = Array.from(
    new Set(users.filter((u) => u.role !== "MANAGER").map((u) => u.department))
  ).sort((a, b) => {
    const indexA = deptOrder.indexOf(a.toUpperCase());
    const indexB = deptOrder.indexOf(b.toUpperCase());
    return (indexA > -1 ? indexA : 99) - (indexB > -1 ? indexB : 99);
  });

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 lg:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-10 inline-block text-left w-full">
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            Org <span className="text-blue-600">Hierarchy</span>
          </h1>
          <p className="text-slate-400 text-xs font-medium">Visualizing structure & reporting lines.</p>
        </div>

        <div className="flex flex-col items-center">
          {/* Executive Level */}
          <div className="flex justify-center gap-4 mb-16">
            {managers.map((m) => (
              <OrgCard key={m.id} name={m.name} role={`${m.department} Lead`} variant="manager" />
            ))}
          </div>

          {/* Department Level - Now Sorted */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
            {departments.map((dept) => (
              <Department key={dept} department={dept} users={users} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Department({ department, users }: { department: string; users: OrgUser[] }) {
  // 1. Find all ROs in this department
  const reportingOfficers = users.filter(
    (u) => u.role === "RO" && u.department === department
  );

  // 2. Find employees who report directly to a Manager (no RO)
  const directReports = users.filter(
    (u) => u.role === "EMPLOYEE" && 
           u.department === department && 
           !reportingOfficers.some(ro => ro.id === u.reporting_to)
  );

  // 3. Group direct reports by team so they show "Near that team"
  const teamsWithDirectReports = Array.from(new Set(directReports.map(u => u.team || "General")));

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 bg-slate-800 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8 shadow-lg ring-4 ring-slate-100">
        <FiHexagon className="text-blue-400" />
        {department}
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {/* Render Reporting Lines (ROs) */}
        {reportingOfficers.map((ro) => {
          const subordinates = users.filter((u) => u.reporting_to === ro.id);
          return (
            <div key={ro.id} className="flex flex-col items-center bg-white p-3 rounded-2xl border border-slate-100 shadow-sm w-[180px]">
              <div className="text-[9px] font-black text-blue-500 uppercase mb-2 tracking-tighter">Reporting Line ({ro.team})</div>
              <OrgCard name={ro.name} role="Reporting Officer" variant="ro" />
              <div className="mt-3 w-full flex flex-col gap-1">
                {subordinates.map((emp) => <EmployeeItem key={emp.id} name={emp.name} />)}
              </div>
            </div>
          );
        })}

        {/* Render Direct Reports grouped by their Team (e.g. React) */}
        {teamsWithDirectReports.map(teamName => (
          <div key={teamName} className="flex flex-col items-center bg-slate-50 p-3 rounded-2xl border border-dashed border-slate-200 w-[180px]">
            <div className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-tighter">
              {teamName} Direct Reports
            </div>
            <div className="w-full flex flex-col gap-1">
              {directReports
                .filter(u => (u.team || "General") === teamName)
                .map((emp) => <EmployeeItem key={emp.id} name={emp.name} />)
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sub-components kept the same for original UI look
function EmployeeItem({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-slate-50">
      <div className="h-5 w-5 rounded bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 text-[10px]">
        <FiUser />
      </div>
      <span className="text-[10px] font-bold text-slate-600 truncate">{name}</span>
    </div>
  );
}

function OrgCard({ name, role, variant }: { name: string; role: string; variant?: "manager" | "ro" }) {
  const isManager = variant === "manager";
  return (
    <div className={`relative rounded-2xl flex items-center gap-3 px-4 py-3 border transition-all ${isManager ? "bg-white border-blue-100 shadow-xl w-[200px]" : "bg-white border-slate-100 shadow-sm w-full"}`}>
      <div className={`flex-shrink-0 rounded-xl flex items-center justify-center font-bold ${isManager ? "h-10 w-10 bg-blue-600 text-white" : "h-8 w-8 bg-slate-100 text-slate-500"}`}>
        {isManager ? <FiUsers size={18} /> : <FiUserCheck size={14} />}
      </div>
      <div className="overflow-hidden text-left">
        <h4 className={`font-black text-slate-800 leading-none truncate ${isManager ? "text-xs" : "text-[10px]"}`}>{name}</h4>
        <p className={`text-slate-400 font-bold mt-1 uppercase tracking-tighter ${isManager ? "text-[9px]" : "text-[8px]"}`}>{role}</p>
      </div>
    </div>
  );
}