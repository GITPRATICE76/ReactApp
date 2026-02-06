import LeaveRequestCard from "../components/LeaveRequestCard";

export default function LeaveRequests() {
  const leaveRequests = [
    {
      id: 1,
      employeeName: "Ralph Edwards",
      avatar: "https://i.pravatar.cc/100?img=12",
      leaveType: "Sick Leave",
      status: "Pending" as const,
      from: "Jan 23, 2024",
      to: "Jan 27, 2024",
      days: 4,
    },
    {
      id: 2,
      employeeName: "Brooklyn Simmons",
      avatar: "https://i.pravatar.cc/100?img=32",
      leaveType: "Casual Leave",
      status: "Pending" as const,
      from: "Feb 02, 2024",
      to: "Feb 04, 2024",
      days: 3,
    },
    {
      id: 3,
      employeeName: "Brooklyn Simmons",
      avatar: "https://i.pravatar.cc/100?img=32",
      leaveType: "Casual Leave",
      status: "Pending" as const,
      from: "Feb 02, 2024",
      to: "Feb 04, 2024",
      days: 3,
    },
    {
      id: 4,
      employeeName: "Brooklyn Simmons",
      avatar: "https://i.pravatar.cc/100?img=32",
      leaveType: "Casual Leave",
      status: "Pending" as const,
      from: "Feb 02, 2024",
      to: "Feb 04, 2024",
      days: 3,
    },
  
  ];

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
        {leaveRequests.map((leave) => (
          <LeaveRequestCard
            key={leave.id}
            {...leave}
            onApprove={() => console.log("Approved", leave.id)}
            onReject={() => console.log("Rejected", leave.id)}
          />
        ))}
      </div>

    </div>
  );
}
