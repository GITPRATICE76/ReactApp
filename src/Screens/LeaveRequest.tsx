import { useEffect, useState } from "react";
import axiosInstance from "../Routes/axiosInstance";
import { toast } from "react-toastify";
import { GET_LEAVES_URL, ACTION_URL } from "../services/userapi.service";

type LeaveRequest = {
  id: number;
  employeeName: string;
  leaveType: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  from: string;
  to: string;
  days: number;
  reason: string;
};

export default function LeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const rowsPerPage = 10;

  // Filters
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<
    "APPROVED" | "REJECTED" | null
  >(null);
  const [remarks, setRemarks] = useState("");

  const managerId = Number(localStorage.getItem("userid"));
  

  // Fetch leaves
const fetchLeaves = async (page = 1) => {
  try {
    setLoading(true);

    const payload = {
      employee: employeeSearch,
      search: searchTerm,
      start: fromFilter,
      end: toFilter,
      status: statusFilter,
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

const today = new Date();
today.setHours(0, 0, 0, 0);

const futureLeaves = leaveRequests.filter((leave) => {
  const leaveEnd = new Date(leave.to);
  leaveEnd.setHours(0, 0, 0, 0);

  return leaveEnd >= today;
});

useEffect(() => {
  fetchLeaves(1);
}, []);

  // Remove past leaves
  // const today = new Date();
  // today.setHours(0, 0, 0, 0);

  // const activeLeaves = leaveRequests.filter((leave) => {
  //   const leaveEndDate = new Date(leave.to);
  //   leaveEndDate.setHours(0, 0, 0, 0);
  //   return leaveEndDate >= today;
  // });

  // Apply filters
  // const filteredLeaves = activeLeaves.filter((leave) => {
  //   const leaveFrom = new Date(leave.from);
  //   const leaveTo = new Date(leave.to);

  //   const matchStatus = statusFilter === "ALL" || leave.status === statusFilter;
  //   // Employee Search
  //   const matchEmployeeSearch = leave.employeeName
  //     .toLowerCase()
  //     .includes(employeeSearch.toLowerCase());

  //   // General Search (Reason + Leave Type)
  //   const matchGeneralSearch =
  //     leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase());

  //   // Date Filter
  //   let matchDate = true;

  //   if (fromFilter && toFilter) {
  //     const selectedFrom = new Date(fromFilter);
  //     const selectedTo = new Date(toFilter);

  //     selectedFrom.setHours(0, 0, 0, 0);
  //     selectedTo.setHours(0, 0, 0, 0);

  //     matchDate = leaveFrom <= selectedTo && leaveTo >= selectedFrom;
  //   } else if (fromFilter) {
  //     const selectedFrom = new Date(fromFilter);
  //     selectedFrom.setHours(0, 0, 0, 0);
  //     matchDate = leaveTo >= selectedFrom;
  //   } else if (toFilter) {
  //     const selectedTo = new Date(toFilter);
  //     selectedTo.setHours(0, 0, 0, 0);
  //     matchDate = leaveFrom <= selectedTo;
  //   }

  //   // const matchFrom = !fromFilter || leaveFrom >= new Date(fromFilter);

  //   // const matchTo = !toFilter || leaveTo <= new Date(toFilter);

  //   return (
  //     matchStatus && matchDate && matchEmployeeSearch && matchGeneralSearch
  //   );
  // });

  const openActionModal = (
    leaveId: number,
    action: "APPROVED" | "REJECTED",
  ) => {
    setSelectedLeaveId(leaveId);
    setSelectedAction(action);
    setRemarks("");
    setShowModal(true);
  };

  const submitAction = async () => {
    if (!remarks.trim()) {
      toast.error("Remarks are required");
      return;
    }

    try {
      await axiosInstance.post(ACTION_URL, {
        user_id: managerId,
        leave_id: selectedLeaveId,
        action: selectedAction,
        remarks,
      });

      setLeaveRequests((prev) =>
        prev.map((leave) =>
          leave.id === selectedLeaveId
            ? { ...leave, status: selectedAction! }
            : leave,
        ),
      );

      toast.success(
        selectedAction === "APPROVED"
          ? "Leave approved successfully"
          : "Leave rejected successfully",
      );

      setShowModal(false);
    } catch {
      toast.error("Failed to update leave");
    }
  };

  if (loading) return <p>Loading leave requests...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#1e40af]">
          Leave Requests
        </h1>
        <p className="text-sm text-gray-500">
          Review and manage employee leave requests
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search by employee name..."
          value={employeeSearch}
          onChange={(e) => setEmployeeSearch(e.target.value)}
          className="border p-2 rounded-lg w-64"
        />

        {/* General Search */}
        <input
          type="text"
          placeholder="Search reason or leave type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-lg w-64"
        />

        <input
          type="date"
          value={fromFilter}
          onChange={(e) => setFromFilter(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <input
          type="date"
          value={toFilter}
          onChange={(e) => setToFilter(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <button
  onClick={() => fetchLeaves(1)}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
>
  Search
</button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left rounded-md">
              <th className="p-3">Employee</th>
              <th className="p-3">Leave Type</th>
              <th className="p-3">From</th>
              <th className="p-3">To</th>
              <th className="p-3">Days</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

        <tbody>
  {futureLeaves.length === 0 ? (
    <tr>
      <td colSpan={8} className="text-center p-4 text-gray-500">
        No leave records found
      </td>
    </tr>
  ) : (
    futureLeaves.map((leave) => (
      <tr key={leave.id} className="border-b hover:bg-gray-50">
        <td className="p-3">{leave.employeeName}</td>
        <td className="p-3">{leave.leaveType}</td>
        <td className="p-3">{leave.from}</td>
        <td className="p-3">{leave.to}</td>
        <td className="p-3">{leave.days}</td>
        <td className="p-3">{leave.reason}</td>

        <td className="p-3">
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              leave.status === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : leave.status === "APPROVED"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {leave.status}
          </span>
        </td>

        {/* 🔥 Action buttons (UNCHANGED) */}
        <td className="p-3 space-x-2">
          {leave.status === "PENDING" && (
            <>
              <button
                onClick={() => openActionModal(leave.id, "APPROVED")}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Approve
              </button>

              <button
                onClick={() => openActionModal(leave.id, "REJECTED")}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject
              </button>
            </>
          )}

          {leave.status === "APPROVED" && (
            <button
              onClick={() => openActionModal(leave.id, "REJECTED")}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reject
            </button>
          )}

          {leave.status === "REJECTED" && (
            <button
              onClick={() => openActionModal(leave.id, "APPROVED")}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Approve
            </button>
          )}
        </td>
      </tr>
    ))
  )}
</tbody>
        </table>
        <div className="flex justify-center gap-2 mt-4">

  <button
    disabled={currentPage === 1}
    onClick={() => fetchLeaves(currentPage - 1)}
    className="px-3 py-1 bg-gray-200 rounded"
  >
    Prev
  </button>

  {Array.from(
    { length: Math.max(1, Math.ceil(totalRecords / rowsPerPage)) },
    (_, i) => (
      <button
        key={i}
        onClick={() => fetchLeaves(i + 1)}
        className={`px-3 py-1 rounded ${
          currentPage === i + 1
            ? "bg-blue-600 text-white"
            : "bg-gray-200"
        }`}
      >
        {i + 1}
      </button>
    )
  )}

  <button
    disabled={currentPage === Math.ceil(totalRecords / rowsPerPage)}
    onClick={() => fetchLeaves(currentPage + 1)}
    className="px-3 py-1 bg-gray-200 rounded"
  >
    Next
  </button>

</div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">
              {selectedAction === "APPROVED" ? "Approve Leave" : "Reject Leave"}
            </h2>

            <textarea
              className="w-full border rounded-lg p-2"
              rows={4}
              placeholder="Enter remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className={`px-4 py-2 rounded-lg text-white ${
                  selectedAction === "APPROVED" ? "bg-green-600" : "bg-red-600"
                }`}
                onClick={submitAction}
              >
                {selectedAction === "APPROVED" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
