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
};

export default function OrganizationChart() {
  const [users, setUsers] = useState<OrgUser[]>([]);

  useEffect(() => {
    axiosInstance.get(ORG_CHART_URL).then((res) => {
      setUsers(Array.isArray(res.data) ? res.data : []);
    });
  }, []);

  const managers = users.filter((u) => u.role === "MANAGER");
  const departments = Array.from(
    new Set(users.filter((u) => u.role !== "MANAGER").map((u) => u.department))
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 lg:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">
              Org <span className="text-blue-600">Hierarchy</span>
            </h1>
            <p className="text-slate-400 text-xs font-medium">Visualizing structure & team reporting lines.</p>
          </div>
        </div>

        {/* Chart Container */}
        <div className="flex flex-col items-center">
          
          {/* Executive Level */}
          {/* <div className="mb-2 uppercase tracking-[2px] text-[10px] font-black text-slate-400">Executive Management</div> */}
          <div className="flex justify-center gap-4 mb-16 relative">
            {managers.map((m) => (
              <OrgCard 
                key={m.id} 
                name={m.name} 
                role={`${m.department} Lead`} 
                variant="manager" 
              />
            ))}
            {/* Visual connector line down */}
            {/* <div className="absolute -bottom-10 left-1/2 w-px h-10 bg-slate-200 hidden md:block"></div> */}
          </div>

          {/* Department Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full relative">
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
  const teams = Array.from(
    new Set(users.filter((u) => u.department === department && u.team).map((u) => u.team!))
  ).sort();

  return (
    <div className="flex flex-col items-center">
      {/* Department Label */}
      <div className="flex items-center gap-2 bg-slate-800 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8 shadow-lg ring-4 ring-slate-100">
        <FiHexagon className="text-blue-400" />
        {department}
      </div>

      {/* Teams Grid */}
      <div className="flex flex-wrap justify-center gap-6">
        {teams.map((team) => {
          const ro = users.find(u => u.role === "RO" && u.department === department && u.team === team);
          const employees = users.filter(u => u.role === "EMPLOYEE" && u.department === department && u.team === team);

          return (
            <div key={team} className="flex flex-col items-center bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="text-[9px] font-black text-blue-500 uppercase mb-2 tracking-tighter">Team {team}</div>
              
              {/* Reporting Officer (TL) */}
              {ro ? (
                <OrgCard name={ro.name} role="Team Leader" variant="ro" />
              ) : (
                <div className="w-[140px] py-2 border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center text-[10px] text-slate-300 font-bold">No Lead</div>
              )}

              {/* Employees Stack */}
              <div className="mt-3 w-full flex flex-col gap-1">
                {employees.map((emp) => (
                  <div key={emp.id} className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors group">
                    <div className="h-5 w-5 rounded bg-white flex items-center justify-center text-slate-400 group-hover:text-blue-600 border border-slate-100 text-[10px]">
                      <FiUser />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 truncate">{emp.name}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrgCard({ name, role, variant }: { name: string; role: string; variant?: "manager" | "ro" }) {
  const isManager = variant === "manager";
  
  return (
    <div className={`
      relative rounded-2xl flex items-center gap-3 px-4 py-3 border transition-all
      ${isManager 
        ? "bg-white border-blue-100 shadow-xl shadow-blue-900/5 w-[200px]" 
        : "bg-white border-slate-100 shadow-sm w-[150px]"}
    `}>
      <div className={`
        flex-shrink-0 rounded-xl flex items-center justify-center font-bold
        ${isManager ? "h-10 w-10 bg-blue-600 text-white" : "h-8 w-8 bg-slate-100 text-slate-500"}
      `}>
        {isManager ? <FiUsers size={18} /> : <FiUserCheck size={14} />}
      </div>
      
      <div className="overflow-hidden">
        <h4 className={`font-black text-slate-800 leading-none truncate ${isManager ? "text-xs" : "text-[10px]"}`}>
          {name}
        </h4>
        <p className={`text-slate-400 font-bold mt-1 uppercase tracking-tighter ${isManager ? "text-[9px]" : "text-[8px]"}`}>
          {role}
        </p>
      </div>
    </div>
  );
}