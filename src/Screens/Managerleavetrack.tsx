import { useEffect, useState } from "react";
import axiosInstance from "../Routes/axiosInstance";
import { ED_URL } from "../services/userapi.service";
import { FiBell, FiUsers, FiClock, FiCheckCircle, FiXCircle, FiActivity } from "react-icons/fi";

export default function Managerleavetrack() {
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

  if (loading) return <div className="p-4 text-xs font-black text-slate-400 uppercase animate-pulse">Loading tracker...</div>;
  if (error) return <div className="p-4 text-xs font-black text-rose-500 uppercase">{error}</div>;

  return (
    <div className="space-y-4 w-full p-4 bg-[#fcfdfe] min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-xl font-black text-slate-800 tracking-tight">Leave Management</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personal & Team Leave Overview</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard title="Total Requests" value={data.total_leaves_taken} sub="Approved" color="indigo" icon={<FiActivity size={14}/>} />
        <StatCard title="Pending" value={data.pending_requests} sub="Awaiting Action" color="amber" icon={<FiClock size={14}/>} />
        <StatCard title="Rejected" value={data.rejected_requests} sub="Disapproved" color="rose" icon={<FiXCircle size={14}/>} />
        <StatCard title="Casual" value={data.casual_leaves} sub="Days Taken" color="purple" icon={<FiCheckCircle size={14}/>} />
        <StatCard title="Sick" value={data.sick_leaves} sub="Days Taken" color="emerald" icon={<FiCheckCircle size={14}/>} />
        <StatCard title="On Leave" value={data.currently_on_leave ? "YES" : "NO"} sub="Status Today" color="blue" icon={<FiUsers size={14}/>} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* TEAM MEMBERS ON LEAVE */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm h-full">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FiUsers className="text-indigo-600" />Team Members Currently On Leave
            </h2>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {data.team_total_on_leave === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-300 uppercase italic">All members present</p>
                </div>
              ) : (
                data.team_members_on_leave?.map((member: any) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-black text-slate-700">{member.name}</span>
                    <span className="text-[9px] font-black bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full uppercase">On Leave</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* LEAVE REMARKS TABLE */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm overflow-hidden">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FiBell className="text-amber-500" /> Recent Remarks
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="pb-3 text-[9px] font-black text-slate-400 uppercase">Type</th>
                    <th className="pb-3 text-[9px] font-black text-slate-400 uppercase">Period</th>
                    <th className="pb-3 text-[9px] font-black text-slate-400 uppercase text-center">Days</th>
                    <th className="pb-3 text-[9px] font-black text-slate-400 uppercase">Status</th>
                    <th className="pb-3 text-[9px] font-black text-slate-400 uppercase">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.leave_remarks?.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 text-[11px] font-bold text-slate-700">{item.leave_type}</td>
                      <td className="py-3 text-[10px] font-bold text-slate-500">
                        {new Date(item.from_date).toLocaleDateString("en-GB")} - {new Date(item.to_date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="py-3 text-[11px] font-black text-slate-700 text-center">{item.days}</td>
                      <td className="py-3">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                          item.status === "APPROVED" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 text-[10px] font-medium text-slate-500 max-w-[150px] truncate">
                        {item.remarks || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPACT SUB-COMPONENTS ================= */

function StatCard({ title, value, sub, color, icon }: any) {
  const colors: any = {
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100",
  };

  return (
    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg border ${colors[color]}`}>{icon}</div>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter truncate">{title}</p>
      </div>
      <p className={`text-lg font-black tracking-tight leading-none text-slate-800`}>{value}</p>
      <p className="text-[8px] font-bold text-slate-400 truncate mt-1.5 uppercase tracking-tighter">{sub}</p>
    </div>
  );
}