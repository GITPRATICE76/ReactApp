import { useEffect, useState } from "react";
import axiosInstance from "../Routes/axiosInstance";
import { toast } from "react-toastify";
import {
  GET_LEAVES_URL,
  ACTION_URL,
  DELETE_LEAVE_URL,
} from "../services/userapi.service";
// import { FaTrash } from "react-icons/fa";

type LeaveRequest = {
  id: number;
  employeeName: string;
  leaveType: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  from: string;
  to: string;
  days: number;
  reason: string;
  Created: string;
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
  const [selectedAction, setSelectedAction] = useState<
    "APPROVED" | "REJECTED" | null
  >(null);
  const [remarks, setRemarks] = useState("");

  const managerId = Number(localStorage.getItem("userid"));
  const userId = localStorage.getItem("userid");

  // ✅ FETCH
  const fetchLeaves = async (
    page = 1,
    filters?: {
      employee?: string;
      search?: string;
      start?: string;
      end?: string;
      status?: string;
    },
  ) => {
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

  useEffect(() => {
    fetchLeaves(1);
  }, []);

  // ✅ REFRESH RESET
  const handleRefresh = () => {
    // reset UI
    setEmployeeSearch("");
    setSearchTerm("");
    setFromFilter("");
    setToFilter("");
    setStatusFilter("ALL");
    setCurrentPage(1);

    // ✅ send empty payload explicitly
    fetchLeaves(1, {
      employee: "",
      search: "",
      start: "",
      end: "",
      status: "ALL",
    });

    setRotate(true);
    setTimeout(() => setRotate(false), 600);
  };
  // ✅ MODAL
  const openActionModal = (id: number, action: "APPROVED" | "REJECTED") => {
    setSelectedLeaveId(id);
    setSelectedAction(action);
    setRemarks("");
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await axiosInstance.delete(`${DELETE_LEAVE_URL}?id=${deleteId}`);

      toast.success("Deleted successfully");
      fetchLeaves(currentPage);

      setShowDeleteModal(false);
      setDeleteId(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  const submitAction = async () => {
    if (!remarks.trim()) {
      toast.error("Remarks required");
      return;
    }

    try {
      await axiosInstance.post(ACTION_URL, {
        user_id: managerId,
        leave_id: selectedLeaveId,
        action: selectedAction,
        remarks,
      });

      fetchLeaves(currentPage);

      toast.success("Updated successfully");
      setShowModal(false);
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Leave Requests</h1>

        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <span className={rotate ? "animate-spin" : ""}>🔄</span>
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search employee..."
          value={employeeSearch}
          onChange={(e) => setEmployeeSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg w-60"
        />

        <input
          type="text"
          placeholder="Search reason..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-lg w-60"
        />

        <input
          type="date"
          value={fromFilter}
          onChange={(e) => setFromFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />

        <input
          type="date"
          value={toFilter}
          onChange={(e) => setToFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <button
          onClick={() => fetchLeaves(1)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          {/* HEADER */}
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Employee</th>
              <th className="p-2 border">Leave Type</th>
              <th className="p-2 border">From</th>
              <th className="p-2 border">To</th>
              <th className="p-2 border">Days</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {leaveRequests.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center p-4">
                  No data available
                </td>
              </tr>
            ) : (
              leaveRequests.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{leave.employeeName}</td>
                  <td className="p-2 border">{leave.leaveType}</td>
                  <td className="p-2 border">{leave.from}</td>
                  <td className="p-2 border">{leave.to}</td>
                  <td className="p-2 border">{leave.days}</td>
                  {new Date(leave.Created).toLocaleString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                  <td className="p-2 border">{leave.reason}</td>

                  {/* STATUS */}
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
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

                  <td className="p-2 border">
                    <td className="p-2 border space-x-2">
                      {/* APPROVE */}
                      {leave.status !== "APPROVED" && (
                        <button
                          onClick={() => openActionModal(leave.id, "APPROVED")}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Approve
                        </button>
                      )}

                      {/* REJECT */}
                      {leave.status !== "REJECTED" && (
                        <button
                          onClick={() => openActionModal(leave.id, "REJECTED")}
                          className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Reject
                        </button>
                      )}

                      {leave.status === "PENDING" && (
                        <button
                          onClick={() => {
                            setDeleteId(leave.id);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800 ml-2"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => fetchLeaves(currentPage - 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Prev
        </button>

        {Array.from(
          { length: Math.ceil(totalRecords / rowsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => fetchLeaves(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ),
        )}

        <button
          onClick={() => fetchLeaves(currentPage + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 space-y-4">
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter remarks"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)}>Cancel</button>

              <button
                onClick={submitAction}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 text-center space-y-4">
            {/* No message (as you requested) */}
            <p className="text-gray-700 font-medium">
              Are you sure you want to delete?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
