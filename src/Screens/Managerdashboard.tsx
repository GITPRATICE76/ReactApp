import { useEffect, useState } from "react";
import axiosInstance from "../Routes/axiosInstance";
import WorkHoursChart from "../components/ui/BarChart";
import type { DayAnalytics } from "../shared/analytics";
import CardComp from "../components/ui/CardComp";
import EmployeeListCard from "../components/EmployeeListCard";

export default function Managerdashboard() {
  const [analyticsData, setAnalyticsData] = useState<DayAnalytics[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayAnalytics | null>(null);

  /* ================= FETCH ANALYTICS ================= */

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const today = new Date();
        const end = new Date();
        end.setDate(today.getDate() + 30);

        const format = (d: Date) => d.toISOString().split("T")[0];

        const res = await axiosInstance.get(
          `/leave/analytics?start=${format(today)}&end=${format(end)}`,
        );

        setAnalyticsData(res.data);
      } catch (error) {
        console.error("Analytics load failed", error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6 w-full">
      {/* ================= TOP SUMMARY ================= */}
      <div className="bg-white rounded-xl shadow-sm border  p-6 overflow-hidden">
        <h2 className="text-lg  text-center font-semibold text-black-400">
          TEAM OVERVIEW
        </h2>

        <div className="relative mt-2">
          <div className="whitespace-nowrap animate-marquee text-lg font-extrabold text-[#1e40af]">
            LIVE RESOURCE AVAILABILITY ANALYTICS — MONITOR TEAM LEAVE TRENDS
          </div>
        </div>
      </div>

      {/* ================= GRID SECTION ================= */}
      <div className="grid grid-cols-12 gap-6 w-full items-stretch">

        {/* ================= LEFT DETAIL PANEL ================= */}
        <div className="col-span-12 lg:col-span-4 flex">
          <div className="flex-1">
            <CardComp title="Selected Day Details">
              {selectedDay ? (
                <div className="space-y-5">

                  {/* DATE SECTION */}
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl p-4 shadow">
                    <p className="text-xs opacity-80">Date</p>
                    <p className="text-xl font-semibold">
                      {selectedDay.date}
                    </p>
                  </div>

                  {/* MAIN STATS GRID */}
                  <div className="grid grid-cols-2 gap-4">

                    <InfoCard
                      label="Total Resources"
                      value={selectedDay.total_resources}
                    />

                    <InfoCard
                      label="On Leave"
                      value={selectedDay.on_leave}
                      highlight="text-red-500"
                    />

                    <InfoCard
                      label="% On Leave"
                      value={`${selectedDay.leave_percentage}%`}
                    />

                    <InfoCard
                      label="% Available"
                      value={`${selectedDay.available_percentage}%`}
                      highlight="text-green-600"
                    />

                  </div>

                  {/* REMAINING ALLOWED */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-xs text-yellow-700">
                      Remaining Allowed %
                    </p>
                    <p className="text-lg font-semibold text-yellow-800">
                      {selectedDay.remaining_allowed_percentage}%
                    </p>
                  </div>

                  {/* EMPLOYEE LIST */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">
                      Employees On Leave
                    </p>

                    {!selectedDay.employees_on_leave ||
                    selectedDay.employees_on_leave.length === 0 ? (
                      <div className="text-center py-4 text-green-600 text-sm font-medium">
                        No employees on leave
                      </div>
                    ) : (
                      <ul className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedDay.employees_on_leave.map((name, index) => (
                          <li
                            key={index}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm shadow-sm"
                          >
                            {name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                </div>
              ) : (
                <div className="text-gray-400 text-sm h-[300px] flex items-center justify-center">
                  Click a bar to view details
                </div>
              )}
            </CardComp>
          </div>
        </div>

        {/* ================= RIGHT CHART ================= */}
        <div className="col-span-12 lg:col-span-8 flex">
          <WorkHoursChart
            analytics={analyticsData}
            onBarClick={(day) => setSelectedDay(day)}
          />
        </div>
      </div>

      <EmployeeListCard />
    </div>
  );
}

/* ================= SMALL INFO CARD COMPONENT ================= */

function InfoCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-semibold ${highlight || "text-gray-800"}`}>
        {value}
      </p>
    </div>
  );
}
