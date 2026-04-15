import { useState } from "react";
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
};
 
export default function LeaveHistory() {
  const [historyData, setHistoryData] = useState<LeaveHistory[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
 
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
 
  const [totalRecords, setTotalRecords] = useState(0);
 
  const totalPages = Math.ceil(totalRecords / rowsPerPage);
 
  const fetchLeaveHistory = async (page = 1) => {
    try {
      const payload = {
        page: page,
        limit: rowsPerPage,
        start: startDate,
        end: endDate,
        search: search,
      };
 
      const res = await axiosInstance.post(LEAVE_HISTORY_URL, payload);
 
      setHistoryData(res.data.data || []);
      setTotalRecords(res.data.total || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Leave history load failed", error);
      toast.error("Failed to load leave history");
    }
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
      <h2 className="text-lg font-semibold mb-4">Leave History</h2>
 
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
 
        <button
          onClick={() => fetchLeaveHistory(1)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
 
        <button
          onClick={downloadExcel}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Download Excel
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
                  <td className="p-2 border">{row.from_date.split("T")[0]}</td>
                  <td className="p-2 border">{row.to_date.split("T")[0]}</td>
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
 
 