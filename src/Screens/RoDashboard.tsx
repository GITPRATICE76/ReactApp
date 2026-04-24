import { useEffect, useState } from "react";
import { FiBell, FiUsers, FiClock, FiCheckCircle, FiXCircle, FiActivity, FiCalendar } from "react-icons/fi";
import axiosInstance from "../Routes/axiosInstance";
import { ED_URL } from "../services/userapi.service";

export default function Rodashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get(ED_URL);
        setData(res.data);
      } catch (err: any) {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-10 font-black text-slate-300 animate-pulse uppercase tracking-widest text-xs">Loading...</div>;
  if (error) return <div className="p-10 text-rose-500 font-bold">{error}</div>;

  return (
    <div className="bg-[#f4f7fe] min-h-screen p-6 space-y-6">
      
      {/* 1. TOP HEADER */}
      <div className="mb-4">
        <h1 className="text-[26px] font-black text-[#1e293b] leading-tight tracking-tight">RO Dashboard</h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Management & Feedback Overview</p>
      </div>

      {/* 2. STATS GRID (Match your screenshot's card style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard label="Total Requests" value={data.total_leaves_taken} sub="Approved" icon={<FiActivity className="text-indigo-500" />} />
        <MetricCard label="Pending" value={data.pending_requests} sub="Awaiting Action" icon={<FiClock className="text-amber-500" />} />
        <MetricCard label="Rejected" value={data.rejected_requests} sub="Disapproved" icon={<FiXCircle className="text-rose-500" />} />
        <MetricCard label="Casual" value={data.casual_leaves} sub="Days Taken" icon={<FiCalendar className="text-purple-500" />} />
        <MetricCard label="Sick" value={data.sick_leaves} sub="Days Taken" icon={<FiCheckCircle className="text-emerald-500" />} />
        <MetricCard label="On Leave" value={data.currently_on_leave ? "YES" : "NO"} sub="Status Today" icon={<FiUsers className="text-blue-500" />} />
      </div>

      {/* 3. MAIN CONTENT GRID */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* TEAM ABSENCES PANEL */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FiUsers className="text-indigo-600" size={18} />
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Team Absences</h2>
          </div>
          
          <div className="space-y-3 overflow-y-auto max-h-[450px] custom-scrollbar pr-2">
            {data.team_members_on_leave?.map((member: any) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[13px] font-black text-slate-700">{member.name}</span>
                <span className="px-3 py-1 bg-[#fff1f2] text-[#f43f5e] text-[8px] font-black rounded-lg uppercase">On Leave</span>
              </div>
            ))}
            {data.team_total_on_leave === 0 && <p className="text-center text-slate-300 py-10 text-[10px] font-bold italic">No one is out today</p>}
          </div>
        </div>

        {/* RECENT REMARKS (The Custom Table Design) */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex items-center gap-2 shrink-0">
            <FiBell className="text-amber-500" size={18} />
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Recent Remarks</h2>
          </div>

          <div className="overflow-y-auto max-h-[450px] custom-scrollbar px-6 pb-6">
            <table className="w-full border-separate border-spacing-y-3">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="pb-2">Employee</th>
                  <th className="pb-2">Duration</th>
                  <th className="pb-2 text-center">Days</th>
                  <th className="pb-2 text-center">Status</th>
                  <th className="pb-2">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {data.leave_remarks?.map((item: any) => (
                  <tr key={item.id} className="group">
                    {/* Employee Info Column */}
                    <td className="py-4 px-4 bg-white border-y border-l border-slate-100 rounded-l-2xl group-hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-[12px] font-black">
                          {item.employee_name?.charAt(0) || "L"}
                        </div>
                        <div>
                          <div className="text-[13px] font-black text-slate-800 leading-none mb-1">
                            {item.employee_name || "Self Request"}
                          </div>
                          <div className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter">
                            {item.leave_type}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Period Column */}
                    <td className="py-4 px-4 bg-white border-y border-slate-100 group-hover:bg-slate-50 transition-colors">
                      <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                         {new Date(item.from_date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short' })}
                         <span className="text-slate-300">→</span>
                         {new Date(item.to_date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short' })}
                      </div>
                    </td>

                    {/* Days Column */}
                    <td className="py-4 px-4 bg-white border-y border-slate-100 text-center group-hover:bg-slate-50 transition-colors">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-black rounded-md border border-slate-200">
                        {item.days}D
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className="py-4 px-4 bg-white border-y border-slate-100 text-center group-hover:bg-slate-50 transition-colors">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase flex items-center justify-center gap-1 mx-auto max-w-[100px] border ${
                        item.status === 'APPROVED' 
                          ? 'bg-[#ecfdf5] text-[#10b981] border-[#10b981]/20' 
                          : 'bg-[#fff1f2] text-[#f43f5e] border-[#f43f5e]/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'APPROVED' ? 'bg-[#10b981]' : 'bg-[#f43f5e]'}`} />
                        {item.status}
                      </span>
                    </td>

                    {/* Remarks Column */}
                    <td className="py-4 px-4 bg-white border-y border-r border-slate-100 rounded-r-2xl group-hover:bg-slate-50 transition-colors">
                      <p className="text-[11px] text-slate-400 font-medium italic truncate max-w-[150px]">
                        {item.remarks || "No remarks provided"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= COMPONENT: METRIC CARD ================= */

function MetricCard({ label, value, sub, icon }: any) {
  return (
    <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-white transition-colors">{icon}</div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-black text-[#1e293b] tracking-tighter">{value}</h3>
        <p className="text-[8px] font-black text-slate-300 uppercase tracking-wider leading-none">{sub}</p>
      </div>
    </div>
  );
}