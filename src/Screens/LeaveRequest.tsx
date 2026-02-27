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

  // Filters
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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

  // Fetch Leaves
  useEffect(() => {
    axiosInstance
      .get(GET_LEAVES_URL)
      .then((res) => {
        setLeaveRequests(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => toast.error("Failed to fetch leave requests"))
      .finally(() => setLoading(false));
  }, []);

  // Remove past leaves
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeLeaves = leaveRequests.filter((leave) => {
    const leaveEndDate = new Date(leave.to);
    leaveEndDate.setHours(0, 0, 0, 0);
    return leaveEndDate >= today;
  });

  // Filter Logic
  const filteredLeaves = activeLeaves.filter((leave) => {
    const leaveFrom = new Date(leave.from);
    const leaveTo = new Date(leave.to);

    leaveFrom.setHours(0, 0, 0, 0);
    leaveTo.setHours(0, 0, 0, 0);

    // Status
    const matchStatus =
      statusFilter === "ALL" || leave.status === statusFilter;

    // Employee Search
    const matchEmployeeSearch = leave.employeeName
      .toLowerCase()
      .includes(employeeSearch.toLowerCase());

    // General Search (Reason + Leave Type)
    const matchGeneralSearch =
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase());

    // Date Filter
    let matchDate = true;

    if (fromFilter && toFilter) {
      const selectedFrom = new Date(fromFilter);
      const selectedTo = new Date(toFilter);

      selectedFrom.setHours(0, 0, 0, 0);
      selectedTo.setHours(0, 0, 0, 0);

      matchDate = leaveFrom <= selectedTo && leaveTo >= selectedFrom;
    } else if (fromFilter) {
      const selectedFrom = new Date(fromFilter);
      selectedFrom.setHours(0, 0, 0, 0);
      matchDate = leaveTo >= selectedFrom;
    } else if (toFilter) {
      const selectedTo = new Date(toFilter);
      selectedTo.setHours(0, 0, 0, 0);
      matchDate = leaveFrom <= selectedTo;
    }

    return (
      matchStatus &&
      matchDate &&
      matchEmployeeSearch &&
      matchGeneralSearch
    );
  });

  const openActionModal = (
    leaveId: number,
    action: "APPROVED" | "REJECTED"
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
            : leave
        )
      );

      toast.success(
        selectedAction === "APPROVED"
          ? "Leave approved successfully"
          : "Leave rejected successfully"
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
      <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4">
        {/* Employee Search */}
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
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
            {filteredLeaves.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-4 text-gray-500">
                  No leave records found
                </td>
              </tr>
            ) : (
              filteredLeaves.map((leave) => (
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

                  <td className="p-3 space-x-2">
                    {leave.status !== "APPROVED" && (
                      <button
                        onClick={() =>
                          openActionModal(leave.id, "APPROVED")
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                    )}

                    {leave.status !== "REJECTED" && (
                      <button
                        onClick={() =>
                          openActionModal(leave.id, "REJECTED")
                        }
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 space-y-4">
            <h2 className="text-lg font-semibold">
              {selectedAction === "APPROVED"
                ? "Approve Leave"
                : "Reject Leave"}
            </h2>

            <textarea
              placeholder="Enter remarks..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full border p-2 rounded-lg"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}