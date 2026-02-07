import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import { APPLY_LEAVE_URL } from "../services/userapi.service";

import axios from "axios";

import { toast } from "react-toastify";

export default function EmployeeLeaveApply() {
  const [leaveType, setLeaveType] = useState("SICK");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [reason, setReason] = useState("");

  const handleApplyLeave = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select from and to date");

      return;
    }

    const userId = localStorage.getItem("userid");

    if (!userId) {
      toast.error("User not logged in");

      return;
    }

    try {
      await axios.post(APPLY_LEAVE_URL, {
        user_id: Number(userId),

        leave_type: leaveType,

        from_date: fromDate,

        to_date: toDate,

        reason: reason,
      });

      toast.success("Leave applied successfully");

      // Reset form

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
        <h1 className="text-2xl font-semibold">Apply Leave</h1>
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
            <label className="text-sm font-medium">Leave Type</label>
            <select
              className="w-full mt-1 border rounded-lg px-3 py-2"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <option value="SICK">Sick Leave</option>
              <option value="CASUAL">Casual Leave</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">To</label>
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
            <label className="text-sm font-medium">Reason</label>
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
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm"
          >
            Apply Leave
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
