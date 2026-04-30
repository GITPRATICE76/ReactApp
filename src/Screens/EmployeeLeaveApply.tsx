import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { APPLY_LEAVE_URL } from "../services/userapi.service";
import axiosInstance from "../Routes/axiosInstance";
import { toast } from "react-toastify";
import { FiSend, FiCalendar, FiEdit3 } from "react-icons/fi";

export default function EmployeeLeaveApply() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [leaveType, setLeaveType] = useState("");

  const [reason, setReason] = useState("");

  // const today = new Date();
  //     const today = new Date().toISOString().split("T")[0];

  // const tomorrow = new Date();
  // tomorrow.setDate(today.getDate() + 1);
  // const minDate = tomorrow.toISOString().split("T")[0];
  const todayDate = new Date();

  // today (string)
  const today = todayDate.toISOString().split("T")[0];

  // tomorrow
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(todayDate.getDate() + 1);
  const minDateCasual = tomorrowDate.toISOString().split("T")[0];

  // past 7 days
  const pastWeekDate = new Date(todayDate);
  pastWeekDate.setDate(todayDate.getDate() - 7);
  const minDateSick = pastWeekDate.toISOString().split("T")[0];

  const handleApplyLeave = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select from and to date");
      return;
    }
    if (!leaveType) {
      toast.error("Please Select Leave Type");
      return;
    }
    if (!reason) {
      toast.error("Please Fill Reason");
      return;
    }

    if (leaveType === "CASUAL" && fromDate === today) {
      toast.error("Cannot apply Casual Leave for today itself");
      return;
    }
    if (leaveType === "SICK") {
      if (fromDate < minDateSick || fromDate > today) {
        toast.error("Sick Leave can only be applied for today or past 7 days");
        return;
      }
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
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to apply leave");
    }
  };

  return (
    <div className="bg-[#f8fafc] h-screen overflow-hidden p-4 lg:p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Apply <span className="text-blue-600">Leave</span>
          </h1>
          <p className="text-slate-400 text-xs font-medium">
            Submit your absence request for manager approval.
          </p>
        </div>

        <Card className="overflow-hidden border-slate-200 shadow-xl shadow-blue-900/5 rounded-3xl bg-white relative">
          {/* Top Decorative Accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-indigo-500" />

          <CardContent className="p-8 space-y-6">
            {/* Dates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[1.5px]">
                  <FiCalendar className="text-blue-500" /> From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  min={leaveType === "SICK" ? minDateSick : minDateCasual}
                  max={leaveType === "SICK" ? today : undefined}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[1.5px]">
                  <FiCalendar className="text-blue-500" /> To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  min={
                    fromDate ||
                    (leaveType === "SICK" ? minDateSick : minDateCasual)
                  }
                  max={leaveType === "SICK" ? today : undefined}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
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

            {/* Reason Textarea */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[1.5px]">
                <FiEdit3 className="text-blue-500" /> Reason for Leave
              </label>
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all placeholder:text-slate-300 resize-none"
                placeholder="Briefly describe why you are taking leave..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleApplyLeave}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-slate-200 active:scale-95"
              >
                <FiSend /> Submit Request
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Note / Info */}
        <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
          <div className="p-1 bg-blue-100 rounded text-blue-600 text-xs">ℹ</div>
          <p className="text-[11px] text-blue-800 leading-relaxed">
            <b>Note:</b> Casual leave requests must be submitted at least 24
            hours in advance. Once submitted, your reporting officer will
            receive a notification for approval.
          </p>
        </div>
      </div>
    </div>
  );
}
