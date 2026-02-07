import { useEffect, useState } from "react";

import LeaveRequestCard from "../components/LeaveRequestCard";

import axios from "axios";

import { GET_LEAVES_URL } from "../services/userapi.service";

type LeaveRequest = {
  id: number;

  employeeName: string;

  leaveType: string;

  status: "Pending" | "Approved" | "Rejected";

  from: string;

  to: string;

  days: number;
};

export default function LeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios

      .get(GET_LEAVES_URL)

      .then((res) => {
        setLeaveRequests(res.data);
      })

      .catch((err) => {
        console.error("Failed to fetch leaves", err);
      })

      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading leave requests...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Leave Requests</h1>
        <p className="text-sm text-muted-foreground">
          Review and manage employee leave requests
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {leaveRequests.length === 0 ? (
          <p>No pending leave requests</p>
        ) : (
          leaveRequests.map((leave) => (
            <LeaveRequestCard
              key={leave.id}
              employeeName={leave.employeeName}
              avatar={`https://i.pravatar.cc/100?u=${leave.employeeName}`}
              leaveType={leave.leaveType}
              status={leave.status}
              from={leave.from}
              to={leave.to}
              days={leave.days}
              onApprove={() => console.log("Approved", leave.id)}
              onReject={() => console.log("Rejected", leave.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
