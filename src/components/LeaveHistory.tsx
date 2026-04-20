import { useEffect, useState } from "react";
import axiosInstance from "../Routes/axiosInstance";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { LEAVE_HISTORY_URL } from "../services/userapi.service";
import { toast } from "react-toastify";

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

export default function LeaveHistory() {
  const [historyData, setHistoryData] = useState<LeaveHistory[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [rotate, setRotate] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [totalRecords, setTotalRecords] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const fetchLeaveHistory = async (
    page = 1,
    filters?: {
      search?: string;
      start?: string;
      end?: string;
      status?: string;
    },
  ) => {
    try {
      setLoading(true); // ✅ start spinning

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
      setLoading(false); // ✅ stop spinning
    }
  };
  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const handleRefresh = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setStatusFilter("ALL");
    setCurrentPage(1);

    fetchLeaveHistory(1, {
      search: "",
      start: "",
      end: "",
      status: "ALL",
    });
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
        days: row.days,
      }));

      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "LeaveHistory");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const data = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(data, "leave_history.xlsx");
    } catch (error) {
      console.error("Excel download failed", error);
      toast.error("Failed to download Excel");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">Leave History</p>
        <button
          onClick={handleRefresh}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <span className={`inline-block ${loading ? "animate-spin" : ""}`}>
            🔄
          </span>
        </button>
      </div>

      {/* Filters */}

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="ALL">All</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <button
          onClick={downloadExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 
             hover:shadow-md 
             active:scale-95 
             transition-all duration-200"
        >
          Download Excel
        </button>
        <button
          onClick={() => fetchLeaveHistory()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg 
             hover:bg-blue-700 
             hover:shadow-md 
             active:scale-95 
             transition-all duration-200"
        >
          Search
        </button>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Employee</th>
              <th className="p-2 border">Team</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">From</th>
              <th className="p-2 border">To</th>
              <th className="p-2 border">Days</th>
              <th className="p-2 border">Leave Type</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {historyData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  No data available
                </td>
              </tr>
            ) : (
              historyData.map((row) => (
                <tr key={row.id}>
                  <td className="p-2 border">{row.employee_name}</td>
                  <td className="p-2 border">{row.team}</td>
                  <td className="p-2 border">{row.department}</td>
                  <td className="p-2 border">
                    {new Date(row.from_date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="p-2 border">
                    {new Date(row.to_date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="p-2 border">{row.days}</td>
                  <td className="p-2 border">{row.leave_type}</td>
                  <td className="p-2 border">{row.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      <div className="flex justify-center gap-2 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => fetchLeaveHistory(currentPage - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => fetchLeaveHistory(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => fetchLeaveHistory(currentPage + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
