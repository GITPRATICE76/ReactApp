import { useEffect, useState } from "react";

import axiosInstance from "../Routes/axiosInstance";

import { toast } from "react-toastify";

import images from "../assets/images.jpg";

import LeaveRequestCard from "../components/LeaveRequestCard";

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

  isEditing?: boolean; // frontend-only
};

export default function LeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  const [loading, setLoading] = useState(true);

  // Modal state

  const [showModal, setShowModal] = useState(false);

  const [selectedLeaveId, setSelectedLeaveId] = useState<number | null>(null);

  const [selectedAction, setSelectedAction] = useState<
    "APPROVED" | "REJECTED" | null
  >(null);

  const [remarks, setRemarks] = useState("");

  const managerId = Number(localStorage.getItem("userid"));

  // Fetch leaves

  useEffect(() => {
    axiosInstance

      .get(GET_LEAVES_URL)

      .then((res) => {
        setLeaveRequests(Array.isArray(res.data) ? res.data : []);
      })

      .catch(() => {
        toast.error("Failed to fetch leave requests");
      })

      .finally(() => setLoading(false));
  }, []);

  // Open approve / reject modal

  const openActionModal = (
    leaveId: number,

    action: "APPROVED" | "REJECTED",
  ) => {
    setSelectedLeaveId(leaveId);

    setSelectedAction(action);

    setRemarks("");

    setShowModal(true);
  };

  // Enable edit mode

  const enableEditMode = (leaveId: number) => {
    setLeaveRequests((prev) =>
      prev.map((leave) =>
        leave.id === leaveId ? { ...leave, isEditing: true } : leave,
      ),
    );
  };

  // Submit approve / reject

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

        remarks: remarks,
      });

      setLeaveRequests((prev) =>
        prev.map((leave) =>
          leave.id === selectedLeaveId
            ? {
                ...leave,

                status: selectedAction!,

                isEditing: false,
              }
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
        <p className="text-sm text-muted-foreground">
          Review and manage employee leave requests
        </p>
      </div>

      {/* Leave Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leaveRequests.length === 0 ? (
          <p>No leave requests found</p>
        ) : (
          leaveRequests.map((leave) => (
            <LeaveRequestCard
              key={leave.id}
              employeeName={leave.employeeName}
              // avatar={`https://i.pravatar.cc/100?u=${leave.employeeName}`}
              avatar={images}
              leaveType={leave.leaveType}
              status={leave.status}
              from={leave.from}
              to={leave.to}
              days={leave.days}
              reason={leave.reason}
              isEditing={leave.isEditing}
              onApprove={() =>
                leave.status === "PENDING" ||
                (leave.status === "REJECTED" && leave.isEditing)
                  ? () => openActionModal(leave.id, "APPROVED")
                  : undefined
              }
              onReject={() =>
                leave.status === "PENDING" ||
                (leave.status === "APPROVED" && leave.isEditing)
                  ? () => openActionModal(leave.id, "REJECTED")
                  : undefined
              }
              onEdit={() =>
                leave.status !== "PENDING" && !leave.isEditing
                  ? () => enableEditMode(leave.id)
                  : undefined
              }
            />
          ))
        )}
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
