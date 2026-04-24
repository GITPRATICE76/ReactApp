import { useEffect, useState } from "react";
import { FiBell, FiUsers, FiClock, FiCheckCircle, FiXCircle, FiActivity } from "react-icons/fi";
import axiosInstance from "../Routes/axiosInstance";
import { ED_URL } from "../services/userapi.service";

export default function Employeedashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get(ED_URL);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-10 font-black text-slate-300 animate-pulse">LOADING...</div>;

  return (
    <div className="bg-[#f8fafc] min-h-screen p-6 space-y-8">
      
      {/* 1. TOP HEADER */}
      <div className="mb-8">
        <h1 className="text-[28px] font-black text-[#1e293b] leading-tight">Leave Management</h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Personal & Team Leave Overview</p>
      </div>

      {/* 2. STATS GRID (Match your screenshot's card style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard label="Total Requests" value={data.total_leaves_taken} sub="Approved" icon={<FiActivity className="text-indigo-500" />} />
        <MetricCard label="Pending" value={data.pending_requests} sub="Awaiting Action" icon={<FiClock className="text-amber-500" />} />
        <MetricCard label="Rejected" value={data.rejected_requests} sub="Disapproved" icon={<FiXCircle className="text-rose-500" />} />
        <MetricCard label="Casual" value={data.casual_leaves} sub="Days Taken" icon={<FiCheckCircle className="text-purple-500" />} />
        <MetricCard label="Sick" value={data.sick_leaves} sub="Days Taken" icon={<FiCheckCircle className="text-emerald-500" />} />
        <MetricCard label="On Leave" value={data.currently_on_leave ? "YES" : "NO"} sub="Status Today" icon={<FiUsers className="text-blue-500" />} />
      </div>

      {/* 3. MAIN CONTENT GRID */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT: TEAM ABSENCES */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FiUsers className="text-indigo-600" size={18} />
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Team Members Currently On Leave</h2>
          </div>
          
          <div className="space-y-3">
            {data.team_members_on_leave?.map((member: any) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                <span className="text-[13px] font-black text-slate-700">{member.name}</span>
                <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[8px] font-black rounded-full uppercase">On Leave</span>
              </div>
            ))}
            {data.team_total_on_leave === 0 && <p className="text-center text-slate-300 py-10 text-[10px] font-bold italic">No one is out today</p>}
          </div>
        </div>

        {/* RIGHT: RECENT REMARKS */}
       {/* RIGHT: RECENT REMARKS */}
<div className="col-span-12 lg:col-span-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex flex-col">
  <div className="flex items-center gap-2 mb-6 shrink-0">
    <FiBell className="text-amber-500" size={18} />
    <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Recent Remarks</h2>
  </div>

  {/* SCROLL CONTAINER */}
  <div className="overflow-y-auto pr-2 max-h-[400px] custom-scrollbar">
    <table className="w-full">
      <thead className="sticky top-0 bg-white z-10">
        <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <th className="pb-4 bg-white">Type</th>
          <th className="pb-4 bg-white">Period</th>
          <th className="pb-4 text-center bg-white">Days</th>
          <th className="pb-4 text-center bg-white">Status</th>
          <th className="pb-4 bg-white">Remarks</th>
        </tr>
      </thead>
      <tbody className="text-slate-600">
        {data.leave_remarks?.map((item: any) => (
          <tr key={item.id} className="border-t border-slate-50 group transition-colors">
            <td className="py-5 text-[12px] font-black text-slate-800 uppercase">{item.leave_type}</td>
            <td className="py-5 text-[11px] font-bold text-slate-500">
              {new Date(item.from_date).toLocaleDateString("en-GB")} - {new Date(item.to_date).toLocaleDateString("en-GB")}
            </td>
            <td className="py-5 text-center text-[12px] font-black text-slate-800">{item.days}</td>
            <td className="py-5 text-center">
              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                item.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {item.status}
              </span>
            </td>
            <td className="py-5 text-[11px] text-slate-400 font-medium italic max-w-[250px] break-words">
              {item.remarks || "No remarks"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
    {!data.leave_remarks?.length && (
      <p className="text-center text-slate-300 py-20 text-[10px] font-bold italic uppercase tracking-widest">
        No History Found
      </p>
    )}
  </div>
</div>

      </div>
    </div>
  );
}

/* ================= COMPONENT: METRIC CARD ================= */

function MetricCard({ label, value, sub, icon }: any) {
  return (
    <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{value}</h3>
        <p className="text-[8px] font-black text-slate-300 uppercase tracking-wider leading-none">{sub}</p>
      </div>
    </div>
  );
}