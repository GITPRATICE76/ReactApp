import { useEffect, useState } from "react";
import axiosInstance from "../Routes/axiosInstance";
import { toast } from "react-toastify";
import {  FiX } from "react-icons/fi";
import {
  GET_LEAVES_URL,
  ACTION_URL,
  DELETE_LEAVE_URL,
  LEAVE_HISTORY_URL,
} from "../services/userapi.service";
import { FiSearch, FiRefreshCw, FiTrash2, FiCalendar, FiClock, FiCheck } from "react-icons/fi";

type LeaveRequest = {
  id: number;
  employeeName: string;
  user_id: any;
  leaveType: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "VIEWHISTORY";
  from: string;
  to: string;
  days: number;
  reason: string;
  Created: string;
  employeeId: number;
};

export default function LeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const rowsPerPage = 10;
  const [rotate, setRotate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [remarks, setRemarks] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");

  const managerId = Number(localStorage.getItem("userid"));
  const userId = localStorage.getItem("userid");

  const fetchLeaves = async (page = 1, filters?: any) => {
    try {
      setLoading(true);
      const payload = {
        user_id: Number(userId),
        employee: filters?.employee ?? employeeSearch,
        search: filters?.search ?? searchTerm,
        start: filters?.start ?? fromFilter,
        end: filters?.end ?? toFilter,
        status: filters?.status ?? statusFilter,
        page: page,
        limit: rowsPerPage,
      };
      const res = await axiosInstance.post(GET_LEAVES_URL, payload);
      setLeaveRequests(res.data.data || []);
      setTotalRecords(res.data.total || 0);
      setCurrentPage(page);
    } catch {
      toast.error("Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeHistory = async (user_id: number, name: string) => {
    try {
      const res = await axiosInstance.post(LEAVE_HISTORY_URL, { user_id });
      setHistoryData(res.data.data || []);
      setSelectedLeaveId(user_id);
      setSelectedEmployeeName(name);
      setShowHistoryModal(true);
    } catch {
      toast.error("Failed to fetch history");
    }
  };

  useEffect(() => { fetchLeaves(1); }, []);

  const handleRefresh = () => {
    setEmployeeSearch(""); setSearchTerm(""); setFromFilter(""); setToFilter(""); setStatusFilter("ALL");
    fetchLeaves(1, { employee: "", search: "", start: "", end: "", status: "ALL" });
    setRotate(true);
    setTimeout(() => setRotate(false), 600);
  };

  const openActionModal = (id: number, action: "APPROVED" | "REJECTED") => {
    setSelectedLeaveId(id); setSelectedAction(action); setRemarks(""); setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axiosInstance.delete(`${DELETE_LEAVE_URL}?id=${deleteId}`);
      toast.success("Deleted successfully");
      fetchLeaves(currentPage);
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch { toast.error("Delete failed"); }
  };

  const submitAction = async () => {
    if (!remarks.trim()) { toast.error("Remarks required"); return; }
    try {
      await axiosInstance.post(ACTION_URL, {
        user_id: managerId, leave_id: selectedLeaveId, action: selectedAction, remarks,
      });
      fetchLeaves(currentPage);
      toast.success("Updated successfully");
      setShowModal(false);
    } catch { toast.error("Update failed"); }
  };

  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  if (loading) return <div className="p-10 text-xs font-black text-slate-400 uppercase animate-pulse">Loading requests...</div>;

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[3px] mb-2 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-indigo-600 rounded-full" /> Leave Administration
          </h2>
          <p className="text-slate-500 text-sm font-medium">Review and manage team leave applications</p>
        </div>
        <button onClick={handleRefresh} className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-500 hover:text-indigo-600 transition-all">
          <FiRefreshCw className={rotate ? "animate-spin" : ""} size={18} />
        </button>
      </div>

      {/* FILTERS SECTION */}
      <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Employee name..." value={employeeSearch} onChange={(e) => setEmployeeSearch(e.target.value)} className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm w-56 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
        </div>
        <input type="text" placeholder="Reason..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm w-48 focus:ring-2 focus:ring-indigo-500/20" />
        <input type="date" value={fromFilter} onChange={(e) => setFromFilter(e.target.value)} className="px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20" />
        <input type="date" value={toFilter} onChange={(e) => setToFilter(e.target.value)} className="px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/20">
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <button onClick={() => fetchLeaves(1)} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100 ml-auto">
          Apply Filter
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
  
  <div className="w-full overflow-x-auto">
    <table className="min-w-[900px] w-full text-left border-collapse">
         <thead className="bg-[#1e293b] text-white">
  <tr className="border-b border-slate-700">
    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-left">Employee</th>
    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-left">From</th>
    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-center">Days</th>
    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-left">Created</th>
    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-left">Reason</th>
    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-center">Status</th>
    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-right pr-10">Actions</th>
  </tr>
</thead>
          <tbody className="divide-y divide-slate-50">
            {leaveRequests.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-slate-400 font-medium italic">No requests found</td></tr>
            ) : (
              leaveRequests.map((leave) => (
                <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 text-sm">{leave.employeeName}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase">{leave.leaveType || 'General Leave'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <span>{new Date(leave.from).toLocaleDateString("en-GB")}</span>
                      <span className="text-slate-300">→</span>
                      <span>{new Date(leave.to).toLocaleDateString("en-GB")}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-xs font-black">{leave.days}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <FiCalendar size={12} className="text-slate-400" />
                            {new Date(leave.Created).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                            <FiClock size={12} className="text-slate-300" />
                            {new Date(leave.Created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-500 italic max-w-[150px] truncate" title={leave.reason}>"{leave.reason}"</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] font-black rounded-full border ${
                        leave.status === "PENDING" ? "bg-amber-50 text-amber-600 border-amber-100" :
                        leave.status === "APPROVED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        "bg-rose-50 text-rose-600 border-rose-100"
                    }`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-2">
  {/* SLOT 1: HISTORY (Always visible) */}
  <div className="w-[85px] flex justify-end">
    <button
      onClick={() => fetchEmployeeHistory(leave.user_id, leave.employeeName)}
      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all active:scale-95 flex items-center gap-1"
    >
      <FiCheck /> History
    </button>
    
  </div>

{/* SLOT 2: APPROVE */}
<div className="w-[40px] flex justify-end">
  {leave.status !== "APPROVED" && (
    <button
      onClick={() => openActionModal(leave.id, "APPROVED")}
      className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-all active:scale-95"
      title="Approve"
    >
      <FiCheck size={16} />
    </button>
  )}
</div>

{/* SLOT 3: REJECT */}
<div className="w-[40px] flex justify-end">
  {leave.status !== "REJECTED" && (
    <button
      onClick={() => openActionModal(leave.id, "REJECTED")}
      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all active:scale-95"
      title="Reject"
    >
      <FiX size={16} />
    </button>
  )}
</div>

  {/* SLOT 4: DELETE */}
  <div className="w-[35px] flex justify-center">
    {leave.status === "PENDING" && (
      <button
        onClick={() => { setDeleteId(leave.id); setShowDeleteModal(true); }}
        className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
        title="Delete"
      >
        <FiTrash2 size={16} />
      </button>
    )}
  </div>
</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
            <p className="text-[10px] font-black text-slate-400 uppercase">Showing {leaveRequests.length} of {totalRecords} records</p>
            <div className="flex gap-1">
                <button disabled={currentPage === 1} onClick={() => fetchLeaves(currentPage - 1)} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black disabled:opacity-30">PREV</button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => fetchLeaves(i + 1)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all ${currentPage === i + 1 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white border border-slate-200 text-slate-600"}`}>
                        {i + 1}
                    </button>
                ))}
                <button disabled={currentPage === totalPages} onClick={() => fetchLeaves(currentPage + 1)} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black disabled:opacity-30">NEXT</button>
            </div>
        </div>
      </div>

      {/* ACTION MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-[100]">
          <div className="bg-white p-8 rounded-[32px] w-96 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-2 uppercase tracking-tight">Process Request</h3>
            <p className="text-slate-500 text-sm mb-6 font-medium">Provide a reason for the {selectedAction === "APPROVED" ? "approval" : "rejection"}.</p>
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full bg-slate-50 border-none rounded-[20px] p-4 text-sm focus:ring-2 focus:ring-indigo-500/20 mb-6 h-32" placeholder="Write internal remarks..." />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-400">Cancel</button>
              <button onClick={submitAction} className={`${selectedAction === "APPROVED" ? 'bg-emerald-600' : 'bg-rose-600'} text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg`}>Confirm {selectedAction}</button>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-[100]">
          <div className="bg-white p-8 rounded-[32px] w-[700px] max-h-[80vh] shadow-2xl border border-slate-100 flex flex-col">
            <h2 className="text-lg font-black text-slate-800 mb-2 uppercase tracking-tight flex items-center gap-2">
              <FiCheck className="text-indigo-600"/> {selectedEmployeeName}'s History
            </h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-6">Log of previous leave requests</p>
            
            <div className="overflow-y-auto pr-2 custom-scrollbar">
                <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase">From</th>
                            <th className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase">To</th>
                            <th className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase text-center">Days</th>
                            <th className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historyData.length === 0 ? (
                            <tr><td colSpan={4} className="text-center py-10 text-slate-400 italic text-sm">No history records found</td></tr>
                        ) : (
                            historyData.map((h) => (
                                <tr key={h.id} className="bg-slate-50/50 rounded-xl overflow-hidden group">
                                    <td className="px-4 py-3 text-xs font-bold text-slate-700 border-y border-l border-slate-100 rounded-l-xl">
                                        {h.from_date.split("T")[0].split("-").reverse().join("/")}
                                    </td>
                                    <td className="px-4 py-3 text-xs font-bold text-slate-700 border-y border-slate-100">
                                        {h.to_date.split("T")[0].split("-").reverse().join("/")}
                                    </td>
                                    <td className="px-4 py-3 text-xs font-black text-slate-700 text-center border-y border-slate-100">
                                        {h.days}
                                    </td>
                                    <td className="px-4 py-3 border-y border-r border-slate-100 rounded-r-xl">
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                                            h.status === "APPROVED" ? "bg-emerald-100 text-emerald-600" : 
                                            h.status === "PENDING" ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
                                        }`}>
                                            {h.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="flex justify-end mt-8">
              <button onClick={() => setShowHistoryModal(false)} className="bg-slate-900 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg">Close History</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-[110]">
          <div className="bg-white p-8 rounded-[32px] w-80 text-center shadow-2xl border border-slate-100">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrash2 size={24} />
            </div>
            <p className="text-slate-800 font-black uppercase text-sm tracking-tight mb-6">Confirm Deletion?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-400">Cancel</button>
              <button onClick={handleDelete} className="px-8 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold shadow-lg">Confirm</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}