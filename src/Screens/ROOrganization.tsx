import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../Routes/axiosInstance";
import { Card, CardContent } from "../components/ui/card";
import images from "../assets/images.png";

/* ================= TYPES ================= */

type Role = "RO" | "EMPLOYEE";

type OrgUser = {
  id: number;
  name: string;
  role: "MANAGER" | "RO" | "EMPLOYEE";
  department: string;
  team: string | null;
};

/* ================= MAIN ================= */

export default function ROOrganizationChart() {
  const [users, setUsers] = useState<OrgUser[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Only trust ID from login
  const team = String(localStorage.getItem("team"));

  useEffect(() => {
    axiosInstance
      .get("http://localhost:8080/api/org-chart")
      .then((res) => setUsers(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  /* ================= FIND LOGGED-IN RO ================= */

  const loggedInRO = useMemo(
    () => users.find((u) => u.team === team && u.role === "RO"),
    [users, team],
  );

  /* ================= FILTER TEAM MEMBERS ================= */

  const teamMembers = useMemo(() => {
    if (!loggedInRO) return [];

    return users.filter(
      (u) =>
        u.role === "EMPLOYEE" &&
        u.department === loggedInRO.department &&
        u.team === loggedInRO.team,
    );
  }, [users, loggedInRO]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading team...</div>;
  }

  if (!loggedInRO) {
    return <div className="p-6 text-center text-red-500">RO not found</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold text-slate-800 mb-6">
        My Team ({loggedInRO.team})
      </h1>

      <div className="flex flex-col items-center gap-4">
        {/* RO CARD */}
        <OrgCard
          name={loggedInRO.name}
          role={`RO – ${loggedInRO.team}`}
          isLeader
        />

        {/* EMPLOYEES */}
        <div className="flex flex-col gap-2 mt-2">
          {teamMembers.length === 0 ? (
            <p className="text-xs text-gray-400">No team members</p>
          ) : (
            teamMembers.map((emp) => (
              <OrgCard key={emp.id} name={emp.name} role={emp.team!} compact />
            ))
          )}
        </div>
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
      } ${compact ? "w-[160px]" : "w-[190px]"}`}
    >
      <CardContent
        className={`flex items-center gap-2 ${compact ? "p-1.5" : "p-2"}`}
      >
        <div
          className={`rounded-full bg-gray-200 overflow-hidden ${
            compact ? "w-7 h-7" : "w-8 h-8"
          }`}
        >
          <img src={images} alt={name} />
        </div>

        <div className="overflow-hidden">
          <p className="font-semibold text-[11px] truncate">{name}</p>
          <p className="text-[10px] text-gray-500 truncate">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
}
