import { useState } from "react";
import axiosInstance from "../Routes/axiosInstance";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { LEAVE_HISTORY_URL } from "../services/userapi.service";

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

const fetchLeaveHistory = async () => {
  try {

    let url = LEAVE_HISTORY_URL;

    if (startDate && endDate) {
      url += `?start=${startDate}&end=${endDate}`;
    }

    const res = await axiosInstance.get(url);

    setHistoryData(res.data || []);

  } catch (error) {
    console.error("Leave history load failed", error);
  }
};

  const downloadExcel = () => {

    const worksheet = XLSX.utils.json_to_sheet(historyData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "LeaveHistory");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream"
    });

    saveAs(data, "leave_history.xlsx");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">

      <h2 className="text-lg font-semibold mb-4">Leave History</h2>

      <div className="flex gap-4 mb-4">

        <input
          type="date"
          value={startDate}
          onChange={(e)=>setStartDate(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e)=>setEndDate(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <button
          onClick={fetchLeaveHistory}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filter
        </button>

        <button
          onClick={downloadExcel}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Download Excel
        </button>

      </div>

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

            {historyData.map((row) => (

              <tr key={row.id}>

                <td className="p-2 border">{row.employee_name}</td>
                <td className="p-2 border">{row.team}</td>
                <td className="p-2 border">{row.department}</td>
                <td className="p-2 border">{row.from_date}</td>
                <td className="p-2 border">{row.to_date}</td>
                <td className="p-2 border">{row.leave_type}</td>
                <td className="p-2 border">{row.status}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}