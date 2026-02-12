import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import { APPLY_LEAVE_URL } from "../services/userapi.service";

import axiosInstance from "../Routes/axiosInstance";
import { toast } from "react-toastify";

export default function EmployeeLeaveApply() {
  const [leaveType, setLeaveType] = useState("");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [reason, setReason] = useState("");

  // const handleApplyLeave = async () => {
  //   if (!fromDate || !toDate) {
  //     toast.error("Please select from and to date");

  //     return;
  //   }

  //   const userId = localStorage.getItem("userid");

  //   if (!userId) {
  //     toast.error("User not logged in");

  //     return;
  //   }

  //   try {
  //     await axiosInstance.post(APPLY_LEAVE_URL, {
  //       user_id: Number(userId),

  //       leave_type: leaveType,

  //       from_date: fromDate,

  //       to_date: toDate,

  //       reason: reason,
  //     });

  //     toast.success("Leave applied successfully");

  //     // Reset form

  //     setFromDate("");

  //     setToDate("");

  //     setReason("");

  //     setLeaveType("");
  //   } catch (err: any) {
  //     toast.error(err.response?.data?.message || "Failed to apply leave");
  //   }
  // };
  const handleApplyLeave = async () => {
    if (!leaveType) {
      toast.error("Please select leave type");
      return;
    }
    if (!reason) {
      toast.error("Please select Reason");
      return;
    }
    if (!fromDate || !toDate) {
      toast.error("Please select from and to date");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    // ❌ Block casual leave for today
    if (leaveType === "CASUAL" && fromDate === today) {
      toast.error("Cannot apply Casual Leave for today itself");
      return;
    }

    const userId = localStorage.getItem("userid");

    if (!userId) {
      toast.error("User not logged in");
      return;
    }

    try {
      await axiosInstance.post(APPLY_LEAVE_URL, {
        user_id: Number(userId),
        leave_type: leaveType,
        from_date: fromDate,
        to_date: toDate,
        reason: reason,
      });

      toast.success("Leave applied successfully");

      setFromDate("");
      setToDate("");
      setReason("");
      setLeaveType("SICK");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to apply leave");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#1e40af]">Apply Leave</h1>
        <p className="text-sm text-gray-500">
          Submit your leave request for approval
        </p>
      </div>

      {/* Leave Form */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#1e40af]">
              Leave Type
            </label>
            <select
              className="w-full mt-1 border rounded-lg px-3 py-2"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <option value="">Select Leave Type</option>

              <option value="SICK">Sick Leave</option>
              <option value="CASUAL">Casual Leave</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#1e40af]">From</label>
              {/* <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              /> */}
              <input
                type="date"
                value={fromDate}
                min={
                  leaveType === "CASUAL"
                    ? new Date(Date.now() + 86400000)
                        .toISOString()
                        .split("T")[0]
                    : undefined
                }
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium  text-[#1e40af]">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="text-sm font-medium  text-[#1e40af]">
              Reason
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full mt-1 border rounded-lg px-3 py-2"
              placeholder="Enter reason for leave"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleApplyLeave}
            className="bg-[#1e40af] text-white px-6 py-2 rounded-lg text-sm"
          >
            Apply Leave
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
