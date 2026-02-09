import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { FiCalendar, FiClock, FiBell, FiUsers } from "react-icons/fi";

export default function Employeedashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Employee Leave Management</h1>
        <p className="text-sm text-gray-500">
          Overview of your leave status and activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Leave Taken"
          value="16 days"
          sub="29 days remaining"
        />
        <StatCard title="Approval Rate" value="92%" sub="This year" />
        <StatCard title="Pending Requests" value="1" sub="Awaiting approval" />
        <StatCard title="Team Member on Leave" value="2" sub="Today" />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Leave Overview</CardTitle>
            <p className="text-xs text-gray-500">
              Your leave distribution for the current year
            </p>
          </CardHeader>

          <CardContent>
            <div className="h-40 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-400 text-sm">
              Leave Chart (Q1 – Q4)
            </div>

            <div className="flex justify-between text-sm mt-4">
              <span>
                Total days: <b>20</b>
              </span>
              <span>
                Remaining: <b>29</b>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Leave */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Leave</CardTitle>
            <p className="text-xs text-gray-500">Your scheduled time off</p>
          </CardHeader>

          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">Annual Leave</p>
              <p className="text-xs text-gray-500">
                Apr 22 – Apr 24, 2025 (3 days)
              </p>
              <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-600">
                Pending
              </span>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
              ⏳ Your leave request is awaiting manager approval
            </div>
          </CardContent>
        </Card>
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
              text="Your leave request for Mar 10–11 has been approved"
              time="2 days ago"
            />
            <Notification
              text="Remember to submit your timesheet for this week"
              time="1 day ago"
            />
            <Notification
              text="Public holiday coming up on May 1st"
              time="Just now"
            />
          </CardContent>
        </Card>

        {/* Team on Leave */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiUsers /> Team Member on Leave
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm">
            <TeamLeave
              name="Sarah Johnson"
              role="UX Designer"
              date="Apr 15 – Apr 19, 2025"
            />
            <TeamLeave
              name="Michael Chen"
              role="Developer"
              date="Apr 18 – Apr 22, 2025"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ================= Small UI Components ================= */

function Tab({ label, active = false }: any) {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm
        ${
          active
            ? "bg-indigo-50 text-indigo-600 font-semibold"
            : "text-gray-500 hover:bg-slate-100"
        }`}
    >
      {label}
    </button>
  );
}

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

function TeamLeave({ name, role, date }: any) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-xs text-gray-500">{role}</p>
      </div>
      <p className="text-xs text-gray-500">{date}</p>
    </div>
  );
}
