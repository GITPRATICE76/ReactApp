import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../Routes/axiosInstance";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { LEAVE_HISTORY_URL } from "../services/userapi.service";
import { toast } from "react-toastify";
import { FiChevronUp, FiChevronDown } from "react-icons/fi"; // Added icons

type LeaveHistory = {
  id: number;
  employee_name: string;
  team: string;
  department: string;
  from_date: string;
  to_date: string;
  leave_type: string;
  status: string;
  days: number;
};

type SortConfig = {
  key: keyof LeaveHistory;
  direction: "asc" | "desc";
} | null;

export default function LeaveHistory() {
  const [historyData, setHistoryData] = useState<LeaveHistory[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  // New: Sort State
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const rowsPerPage = 10;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const fetchLeaveHistory = async (
    page = 1,
    filters?: { search?: string; start?: string; end?: string; status?: string }
  ) => {
    try {
      setLoading(true);
      const payload = {
        page,
        limit: rowsPerPage,
        search: filters?.search ?? search,
        start: filters?.start ?? startDate,
        end: filters?.end ?? endDate,
        status: filters?.status ?? statusFilter,
      };

      const res = await axiosInstance.post(LEAVE_HISTORY_URL, payload);
      setHistoryData(res.data.data || []);
      setTotalRecords(res.data.total || 0);
      setCurrentPage(page);
    } catch {
      toast.error("Failed to load leave history");
    } finally {
      setLoading(false);
    }
  };

  // New: Sorting Logic
  const handleSort = (key: keyof LeaveHistory) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    const sortableItems = [...historyData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [historyData, sortConfig]);

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const handleRefresh = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setStatusFilter("ALL");
    setSortConfig(null);
    setCurrentPage(1);
    fetchLeaveHistory(1, { search: "", start: "", end: "", status: "ALL" });
  };

  const downloadExcel = async () => {
    try {
      const payload = {
        page: 1,
        limit: totalRecords || 1000,
        start: startDate,
        end: endDate,
        search: search,
      };
      const res = await axiosInstance.post(LEAVE_HISTORY_URL, payload);
      const allData = res.data.data || [];
      if (allData.length === 0) {
        toast.warning("No data to download");
        return;
      }
      const formattedData = allData.map((row: any) => ({
        Employee: row.employee_name,
        Team: row.team,
        Department: row.department,
        From: row.from_date.split("T")[0],
        To: row.to_date.split("T")[0],
        LeaveType: row.leave_type,
        Status: row.status,
        Days: row.days,
      }));
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "LeaveHistory");
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(data, "leave_history.xlsx");
    } catch (error) {
      toast.error("Failed to download Excel");
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const s = status.toUpperCase();
    const colorClass = s === "APPROVED" ? "bg-emerald-100 text-emerald-700 ring-emerald-600/20" : 
                       s === "REJECTED" ? "bg-rose-100 text-rose-700 ring-rose-600/20" : 
                       "bg-amber-100 text-amber-700 ring-amber-600/20";
    const dotClass = s === "APPROVED" ? "bg-emerald-600" : 
                     s === "REJECTED" ? "bg-rose-600" : 
                     "bg-amber-600";

    return (
      <span className={`inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[10px] font-bold ring-1 ring-inset ${colorClass}`}>
        <span className={`h-1 w-1 rounded-full ${dotClass}`} />
        {status}
      </span>
    );
  };

  // Helper for Sort Icons
  const SortIcon = ({ column }: { column: keyof LeaveHistory }) => {
    if (sortConfig?.key !== column) return <div className="w-3 h-3 opacity-20" />;
    return sortConfig.direction === "asc" ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />;
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen p-2 lg:p-5 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto shadow-xl rounded-2xl overflow-hidden bg-white border border-slate-200">
        
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500" />

        <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Leave <span className="text-blue-600">History</span>
            </h1>
            <p className="text-slate-400 text-[11px] font-medium">Manage employee absence logs.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="group p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all border border-slate-100"
            >
              <span className={`block text-base ${loading ? "animate-spin" : ""}`}>↻</span>
            </button>
            <button
              onClick={downloadExcel}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md"
            >
              <span>↓</span> Export
            </button>
          </div>
        </div>

        <div className="mx-6 mb-4 p-1.5 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1.5">
          <input
            type="text"
            placeholder="Search name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none px-3 py-1.5 focus:ring-0 text-xs font-medium"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-transparent border-none px-3 py-1.5 text-xs font-medium"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-transparent border-none px-3 py-1.5 text-xs font-medium"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-transparent border-none px-3 py-1.5 text-xs font-bold text-slate-600 appearance-none cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button
            onClick={() => fetchLeaveHistory(1)}
            className="bg-blue-600 hover:bg-indigo-600 text-white font-bold w-full sm:w-40 py-2 rounded-xl transition-all text-xs lg:justify-self-end"
          >
            Search
          </button>
        </div>

        <div className="overflow-x-auto px-6 pb-2">
          <table className="w-full text-left border-separate border-spacing-y-1.5">
            <thead>
              <tr className="bg-slate-800 text-slate-200 text-[9px] uppercase tracking-[1.5px] font-black">
                <th className="px-4 py-2.5 rounded-l-xl cursor-pointer hover:text-blue-400 transition-colors" onClick={() => handleSort('employee_name')}>
                  <div className="flex items-center gap-1">Employee <SortIcon column="employee_name"/></div>
                </th>
                <th className="px-4 py-2.5 cursor-pointer hover:text-blue-400 transition-colors" onClick={() => handleSort('team')}>
                   <div className="flex items-center gap-1">Allocation <SortIcon column="team"/></div>
                </th>
                <th className="px-4 py-2.5 cursor-pointer hover:text-blue-400 transition-colors" onClick={() => handleSort('from_date')}>
                   <div className="flex items-center gap-1">Duration <SortIcon column="from_date"/></div>
                </th>
                <th className="px-4 py-2.5 text-center cursor-pointer hover:text-blue-400 transition-colors" onClick={() => handleSort('days')}>
                   <div className="flex items-center justify-center gap-1">Days <SortIcon column="days"/></div>
                </th>
                <th className="px-4 py-2.5 rounded-r-xl cursor-pointer hover:text-blue-400 transition-colors" onClick={() => handleSort('status')}>
                   <div className="flex items-center gap-1">Status <SortIcon column="status"/></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-10 text-center font-bold text-slate-300 animate-pulse text-xs">Loading...</td></tr>
              ) : sortedData.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-slate-400 text-xs">No records found.</td></tr>
              ) : (
                sortedData.map((row) => (
                  <tr key={row.id} className="group hover:scale-[1.005] transition-all duration-200">
                    <td className="px-4 py-2 bg-white border-y border-l border-slate-100 rounded-l-xl group-hover:bg-slate-50/50">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100 text-xs">
                          {row.employee_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{row.employee_name}</div>
                          <div className="text-[9px] font-bold text-blue-500 uppercase tracking-tight">{row.leave_type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 bg-white border-y border-slate-100 group-hover:bg-slate-50/50">
                      <div className="text-xs font-semibold text-slate-700">{row.team}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{row.department}</div>
                    </td>
                    <td className="px-4 py-2 bg-white border-y border-slate-100 group-hover:bg-slate-50/50">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <span>{new Date(row.from_date).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })}</span>
                        <span className="text-slate-300">→</span>
                        <span>{new Date(row.to_date).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 bg-white border-y border-slate-100 group-hover:bg-slate-50/50 text-center">
                      <div className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-black text-[10px]">
                        {row.days}D
                      </div>
                    </td>
                    <td className="px-4 py-2 bg-white border-y border-r border-slate-100 rounded-r-xl group-hover:bg-slate-50/50">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
          <div className="text-[11px] font-bold text-slate-400">
            Page <span className="text-blue-600">{currentPage}</span> of {totalPages}
          </div>
          <div className="flex gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => fetchLeaveHistory(currentPage - 1)}
              className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-900 hover:text-white transition-all disabled:opacity-30"
            >
              Prev
            </button>
            <div className="hidden sm:flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchLeaveHistory(i + 1)}
                  className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${
                    currentPage === i + 1 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                    : "bg-white text-slate-400 border border-slate-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => fetchLeaveHistory(currentPage + 1)}
              className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-900 hover:text-white transition-all disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}