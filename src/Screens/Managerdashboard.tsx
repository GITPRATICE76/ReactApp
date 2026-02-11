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
        end.setDate(today.getDate() + 6);

        const format = (d: Date) => d.toISOString().split("T")[0];

        const res = await axiosInstance.get(
          `/leave/analytics?start=${format(today)}&end=${format(end)}`
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
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold">Team Overview</h2>
        <p className="text-sm text-gray-500 mt-1">
          Live Resource Availability Analytics
        </p>
      </div>

      {/* ================= GRID SECTION ================= */}
      <div className="grid grid-cols-12 gap-6 w-full">

        {/* LEFT DETAIL PANEL */}
        <div className="col-span-12 lg:col-span-3">
          <CardComp title="Selected Day Details">
            {selectedDay ? (
              <div className="space-y-3">

                <Detail label="Date" value={selectedDay.date} />
                <Detail label="Total Resources" value={`${selectedDay.total_resources}`} />
                <Detail label="On Leave" value={`${selectedDay.on_leave}`} />
                <Detail label="% On Leave" value={`${selectedDay.leave_percentage}%`} />
                <Detail label="% Available" value={`${selectedDay.available_percentage}%`} />
                <Detail
                  label="Remaining Allowed %"
                  value={`${selectedDay.remaining_allowed_percentage}%`}
                />

                {/* Employee Names */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-2">
                    Employees On Leave
                  </p>

                  {selectedDay.employees_on_leave.length === 0 ? (
                    <p className="text-sm text-green-600">
                      No employees on leave 🎉
                    </p>
                  ) : (
                    <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                      {selectedDay.employees_on_leave.map((name, index) => (
                        <li key={index} className="text-gray-700">
                          • {name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>
            ) : (
              <div className="text-gray-400 text-sm h-[200px] flex items-center justify-center">
                Click a bar to view details
              </div>
            )}
          </CardComp>
        </div>

        {/* RIGHT CHART */}
        <div className="col-span-12 lg:col-span-9">
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

/* ================= SMALL DETAIL COMPONENT ================= */

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
