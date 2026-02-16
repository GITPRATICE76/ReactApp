import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { FiBell, FiUsers } from "react-icons/fi";

export default function Employeedashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:8080/api/employee/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

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
        <h1 className="text-2xl font-semibold">Employee Leave Management</h1>
        <p className="text-sm text-gray-500">
          Overview of your leave status and activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Leave Taken"
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
          value={data.casual_leaves}
          sub="Approved"
        />
        <StatCard title="Sick Leaves" value={data.sick_leaves} sub="Approved" />
        <StatCard
          title="Currently On Leave"
          value={data.currently_on_leave ? "Yes" : "No"}
          sub="Today"
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiBell /> Notifications
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            <Notification
              text="Your leave request was approved"
              time="2 days ago"
            />
            <Notification
              text="Remember to apply leave in advance"
              time="1 day ago"
            />
          </CardContent>
        </Card>

        {/* Leave Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiUsers /> Leave Status
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm space-y-2">
            <p>
              Total Approved Leaves: <b>{data.total_leaves_taken}</b>
            </p>
            <p>
              Pending Requests: <b>{data.pending_requests}</b>
            </p>
            <p>
              Rejected Requests: <b>{data.rejected_requests}</b>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 🔥 NEW SECTION: Team Members On Leave */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiUsers /> Team Members Currently On Leave
          </CardTitle>
        </CardHeader>

        <CardContent className="text-sm space-y-2">
          {data.team_total_on_leave === 0 ? (
            <p className="text-gray-500">No team members are on leave today.</p>
          ) : (
            data.team_members_on_leave.map((member: any) => (
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
