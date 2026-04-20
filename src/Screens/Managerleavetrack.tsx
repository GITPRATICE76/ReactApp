import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { FiBell, FiUsers } from "react-icons/fi";

import axiosInstance from "../Routes/axiosInstance";

import { ED_URL } from "../services/userapi.service";

export default function Managerleavetrack() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get(ED_URL);

        setData(res.data);
      } catch (err: any) {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Manager Leave Management</h1>
        <p className="text-sm text-gray-500">
          Overview of your leave status and activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Leave Request"
          value={data.total_leaves_taken}
          sub="Approved"
        />
        <StatCard
          title="Pending Requests"
          value={data.pending_requests}
          sub="Awaiting approval"
        />
        <StatCard
          title="Rejected Requests"
          value={data.rejected_requests}
          sub="Rejected"
        />
        <StatCard
          title="Casual Leaves"
          value={`${data.casual_leaves} days`}
          sub="Approved"
        />
        <StatCard
          title="Sick Leaves"
          value={`${data.sick_leaves} days`}
          sub="Approved"
        />
        <StatCard
          title="Currently On Leave"
          value={data.currently_on_leave ? "Yes" : "No"}
          sub="Today"
        />
      </div>

      {/* 🔥 NEW SECTION: Team Members On Leave */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiUsers />
            Members Currently On Leave
          </CardTitle>
        </CardHeader>

        <CardContent className="text-sm space-y-2">
          {data.team_total_on_leave === 0 ? (
            <p className="text-gray-500">No team members are on leave today.</p>
          ) : (
            data.team_members_on_leave?.map((member: any) => (
              <div
                key={member.id}
                className="flex justify-between border-b pb-1"
              >
                <span>{member.name}</span>
                <span className="text-xs text-gray-400">On Leave</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      {/* 🔥 NEW SECTION: Leave Remarks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiBell /> Leave Remarks
          </CardTitle>
        </CardHeader>

        <CardContent className="text-sm overflow-x-auto">
          {!data.leave_remarks || data.leave_remarks.length === 0 ? (
            <p className="text-gray-500">No remarks available.</p>
          ) : (
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Leave Type</th>
                  <th className="p-2 border">From</th>
                  <th className="p-2 border">To</th>
                  <th className="p-2 border">Days</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Remarks</th>
                </tr>
              </thead>

              <tbody>
                {data.leave_remarks.map((item: any) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 border">{item.leave_type}</td>

                    <td className="p-2 border">
                      {new Date(item.from_date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="p-2 border">
                      {new Date(item.to_date).toLocaleDateString("en-GB")}
                    </td>

                    <td className="p-2 border">{item.days}</td>

                    <td className="p-2 border">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          item.status === "APPROVED"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-2 border">
                      {item.remarks || "No remarks"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiBell /> NOTE
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            <Notification text="Apply leave 1 week in advance" />
            <Notification text="Max 2 casual leaves per month" />
            <Notification text="Sick leave requires medical proof (2+ days)" />
          </CardContent>
        </Card>

        {/* Leave Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiUsers />
              Current Month Leave Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm space-y-2">
            <p>
              Total Leaves Taken: <b>{data.total_leaves_taken}</b>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ================= Reusable Components ================= */

function StatCard({ title, value, sub }: any) {
  return (
    <Card>
      <CardContent className="p-4 space-y-1">
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </CardContent>
    </Card>
  );
}

function Notification({ text, time }: any) {
  return (
    <div className="flex justify-between">
      <p>{text}</p>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  );
}
