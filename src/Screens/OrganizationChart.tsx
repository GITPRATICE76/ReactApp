import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { Edit3 } from "lucide-react";

export default function OrganizationChart() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Organization Chart
        </h1>
        <button className="flex items-center gap-2 border bg-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-shadow shadow-sm">
          <Edit3 size={16} />
          Edit Organization
        </button>
      </div>

      <div
        className="relative bg-white rounded-3xl border border-gray-200 p-12 shadow-sm min-w-max"
        style={{
          backgroundImage: "radial-gradient(#e5e7eb 1.5px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      >
        {/* CEO Section */}
        <div className="flex flex-col items-center mb-10">
          <OrgCard name="Cameron Williamson" role="Founder - CEO" isLeader />
          {/* Vertical line down from CEO to the horizontal bar */}
          <div className="w-px h-10 bg-gray-400"></div>
        </div>

        {/* Main Horizontal Connector */}
        <div
          className="relative h-px bg-gray-400 mb-10 mx-auto"
          style={{ width: "66.6%" }}
        >
          {/* Drop lines to each department */}
          <div className="absolute left-0 h-10 w-px bg-gray-400"></div>
          <div className="absolute left-1/2 -translate-x-1/2 h-10 w-px bg-gray-400"></div>
          <div className="absolute right-0 h-10 w-px bg-gray-400"></div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <Department
            title="Business and Marketing"
            color="bg-indigo-600"
            members={[
              {
                name: "Leslie Alexander",
                role: "Head of Project Manager",
                isHead: true,
              },
              { name: "Cody Firmansyah", role: "Senior Project Manager" },
              { name: "Jenni William", role: "Project Manager" },
            ]}
          />
          <Department
            title="Design"
            color="bg-emerald-500"
            members={[
              {
                name: "Brooklyn Simmons",
                role: "Creative Director",
                isHead: true,
              },
              { name: "Ralph Edwards", role: "Senior UIX Designer" },
              { name: "Brooklyn Hehe", role: "Senior Graphic Design" },
              { name: "Vidi Gutillerezz", role: "UIX Designer" },
              { name: "Pablo Hive", role: "Graphic Design" },
            ]}
          />
          <Department
            title="Development"
            color="bg-blue-500"
            members={[
              {
                name: "Cody Fisher",
                role: "Head of Development",
                isHead: true,
              },
              { name: "Asther Mulyani", role: "Senior Front-End" },
              { name: "Jenny Wilson", role: "QA Engineering" },
              { name: "Eden Khoiruddin", role: "Back-End" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function Department({
  title,
  color,
  members,
}: {
  title: string;
  color: string;
  members: any[];
}) {
  const head = members.find((m) => m.isHead);
  const staff = members.filter((m) => !m.isHead);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`z-10 text-white text-[13px] font-medium px-10 py-2.5 rounded-xl shadow-md mb-6 ${color}`}
      >
        {title}
      </div>

      {/* Head of Department Wrapper */}
      <div className="relative w-full flex justify-center mb-6">
        <OrgCard name={head.name} role={head.role} />

        {/* The "Vertical Spine" starting from the Head's card down */}
        {/* left-8 + w-12/2 (avatar center) = approx 32px or 40px depending on layout */}
        {/* We use an absolute div that starts behind the Head card */}
        <div className="absolute left-[20%] top-1/2 bottom-[-24px] w-px bg-gray-300 -z-10"></div>
      </div>

      {/* Staff Members List */}
      <div className="relative w-full pl-[20%] space-y-4">
        {/* Continuous vertical line for the staff list */}
        <div className="absolute left-0 top-0 bottom-[22px] w-px bg-gray-300"></div>

        {staff.map((m, i) => (
          <div key={i} className="relative flex items-center">
            {/* Horizontal Elbow */}
            <div className="absolute -left-0 w-6 h-px bg-gray-300"></div>
            <div className="pl-6 w-full">
              <OrgCard name={m.name} role={m.role} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrgCard({
  name,
  role,
  isLeader,
}: {
  name: string;
  role: string;
  isLeader?: boolean;
}) {
  return (
    <Card
      className={`min-w-[200px] w-full rounded-2xl border-none shadow-lg bg-white z-10 transition-transform hover:scale-[1.02] ${isLeader ? "ring-1 ring-gray-200" : ""}`}
    >
      <CardContent className="flex items-center gap-3 p-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-100">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
            alt={name}
          />
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-slate-800 text-[13px] truncate leading-tight">
            {name}
          </p>
          <p className="text-[10px] text-gray-500 font-medium truncate">
            {role}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
