import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";
import { Edit3 } from "lucide-react";
import { ORG_CHART_URL } from "../services/userapi.service";
import images from "../assets/images.png";

/* ================= TYPES ================= */

type OrgUser = {
  id: number;
  name: string;
  role: "MANAGER" | "RO" | "EMPLOYEE";
  department: string;
  team: string | null;
};

/* ================= MAIN ================= */

export default function OrganizationChart() {
  const [users, setUsers] = useState<OrgUser[]>([]);

  useEffect(() => {
    axios.get(ORG_CHART_URL).then((res) => {
      setUsers(Array.isArray(res.data) ? res.data : []);
    });
  }, []);

  const managers = users.filter((u) => u.role === "MANAGER");

  const departments = Array.from(
    new Set(users.filter((u) => u.role !== "MANAGER").map((u) => u.department)),
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-800">Organization Chart</h1>
        <button className="flex items-center gap-2 border bg-white px-3 py-1.5 rounded-md text-xs font-medium shadow-sm">
          <Edit3 size={14} />
          Edit Organization
        </button>
      </div>

      <div className="flex flex-col items-center gap-5 mb-12">
        {/* ================= MANAGERS (SAME LINE) ================= */}
        <div className="bg-blue-600 text-white px-8 py-1.5 rounded-lg text-xs font-semibold">
          MANAGERS
        </div>
        <div className="flex justify-center gap-6">
          {managers.map((m) => (
            <OrgCard
              key={m.id}
              name={m.name}
              role={`${m.department} Manager`}
              isLeader
            />
          ))}
        </div>

        {/* ================= DEPARTMENTS (SAME LINE) ================= */}
        <div className="flex justify-center gap-16 items-start">
          {departments.map((dept) => (
            <Department key={dept} department={dept} users={users} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= DEPARTMENT ================= */

function Department({
  department,
  users,
}: {
  department: string;
  users: OrgUser[];
}) {
  const ros = users
    .filter((u) => u.role === "RO" && u.department === department)
    .sort((a, b) => (a.team || "").localeCompare(b.team || ""));

  return (
    <div className="flex flex-col items-center gap-5 min-w-[220px]">
      {/* Department Title */}
      <div className="bg-blue-600 text-white px-6 py-1.5 rounded-lg text-xs font-semibold">
        {department}
      </div>

      {/* Teams (horizontal) */}
      <div className="flex gap-4 items-start">
        {ros.map((ro) => {
          const employees = users.filter(
            (u) =>
              u.role === "EMPLOYEE" &&
              u.department === department &&
              u.team === ro.team,
          );

          return (
            <div
              key={ro.id}
              className="flex flex-col items-center min-w-[160px]"
            >
              {/* RO */}
              <OrgCard name={ro.name} role={`TL (${ro.team})`} />

              {/* Employees (vertical) */}
              <div className="mt-2 flex flex-col gap-1.5 items-center">
                {employees.length === 0 ? (
                  <p className="text-[10px] text-gray-400">No employees</p>
                ) : (
                  employees.map((emp) => (
                    <OrgCard
                      key={emp.id}
                      name={emp.name}
                      role={emp.team!}
                      compact
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= CARD ================= */

function OrgCard({
  name,
  role,
  isLeader,
  compact,
}: {
  name: string;
  role: string;
  isLeader?: boolean;
  compact?: boolean;
}) {
  return (
    <Card
      className={`rounded-lg bg-white shadow-sm ${
        isLeader ? "ring-1 ring-gray-300" : ""
      } ${compact ? "w-[150px]" : "w-[170px]"}`}
    >
      <CardContent
        className={`flex items-center gap-2 ${compact ? "p-1.5" : "p-2"}`}
      >
        <div
          className={`rounded-full bg-gray-200 overflow-hidden ${
            compact ? "w-7 h-7" : "w-8 h-8"
          }`}
        >
          {/* <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
            alt={name}
          /> */}

          <img src={images} />
        </div>
        <div className="overflow-hidden">
          <p className="font-semibold text-[11px] truncate">{name}</p>
          <p className="text-[10px] text-gray-500 truncate">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
}
