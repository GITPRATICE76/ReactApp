import { useEffect, useState } from "react";
import axiosInstance from "../Routes/axiosInstance";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../components/ui/card";

/* ================= TYPES ================= */

type Employee = {
  id: number;
  name: string;
  email: string;
  department: string;
  team: string | null;
  role: string;
};

export default function EmployeeListCard() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  /* ================= FETCH EMPLOYEES ================= */

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axiosInstance.get("/org-chart");

        const filtered = res.data.filter(
          (emp: Employee) => emp.role === "EMPLOYEE"
        );

        setEmployees(filtered);
      } catch (error) {
        console.error("Failed to load employees", error);
      }
    };

    fetchEmployees();
  }, []);

  /* ================= DEPARTMENT COLOR ================= */

  function getDepartmentColor(department: string) {
    const map: Record<string, string> = {
      DEVELOPMENT: "bg-blue-100 text-blue-700",
      QA: "bg-purple-100 text-purple-700",
      HR: "bg-pink-100 text-pink-700",
      Finance: "bg-yellow-100 text-yellow-700",
      Marketing: "bg-orange-100 text-orange-700",
      Support: "bg-cyan-100 text-cyan-700",
      Design: "bg-green-100 text-green-700",
    };

    return map[department] || "bg-gray-100 text-gray-700";
  }

  /* ================= TEAM COLOR (AUTO ROTATION) ================= */

  const teamColors = [
    "bg-indigo-100 text-indigo-700",
    "bg-emerald-100 text-emerald-700",
    "bg-rose-100 text-rose-700",
    "bg-amber-100 text-amber-700",
    "bg-sky-100 text-sky-700",
    "bg-fuchsia-100 text-fuchsia-700",
    "bg-teal-100 text-teal-700",
  ];

  // Create unique team list
  const uniqueTeams = Array.from(
    new Set(
      employees
        .map((emp) => emp.team)
        .filter((team): team is string => Boolean(team))
    )
  );

  function getTeamColor(team: string | null) {
    if (!team) return "bg-gray-100 text-gray-600";

    const index = uniqueTeams.indexOf(team);
    return teamColors[index % teamColors.length];
  }

  return (
    <Card className="rounded-2xl">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">
          Employees
        </CardTitle>

        <button className="text-sm text-indigo-600 border px-3 py-1 rounded-lg hover:bg-indigo-50">
          See Details
        </button>
      </CardHeader>

      {/* Table */}
      <CardContent className="pt-0">
        <div className="grid grid-cols-4 text-xs text-gray-500 px-2 py-2 bg-gray-50 rounded-md">
          <span>Employee Name</span>
          <span>Department</span>
          <span>Team</span>
          <span>Role</span>
        </div>

        <div className="divide-y">
          {employees.length === 0 ? (
            <div className="p-4 text-sm text-gray-400 text-center">
              No employees found
            </div>
          ) : (
            employees.map((emp) => (
              <div
                key={emp.id}
                className="grid grid-cols-4 items-center px-2 py-3 text-sm hover:bg-gray-50 transition"
              >
                {/* Name */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                    {emp.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-xs text-gray-500">{emp.email}</p>
                  </div>
                </div>

                {/* Department */}
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium w-fit ${getDepartmentColor(
                    emp.department
                  )}`}
                >
                  ● {emp.department}
                </span>

                {/* Team (Dynamic Color) */}
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium w-fit ${getTeamColor(
                    emp.team
                  )}`}
                >
                  ● {emp.team || "N/A"}
                </span>

                {/* Role */}
                <span className="text-gray-700">{emp.role}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
