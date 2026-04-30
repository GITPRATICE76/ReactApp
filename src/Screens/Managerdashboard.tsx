import { useEffect, useState } from "react";
import axiosInstance from "../Routes/axiosInstance";
import WorkHoursChart from "../components/ui/BarChart";
import type { DayAnalytics } from "../shared/analytics";
import CardComp from "../components/ui/CardComp";
import LeaveRequests from "./LeaveRequest";
import {
  FiCalendar,
  FiUsers,
  FiTrendingUp,
  FiUser,
  FiClock,
} from "react-icons/fi";

/* ================= TYPES ================= */

type DashboardSummary = {
  highest_leave_date: { date: string; count: number };
  team_highest_leave: { team: string; count: number };
  peak_leave_week: {
    week_number: number;
    start: string;
    end: string;
    count: number;
  };
  team_total_leave?: number;
  top_leave_taker: { name: string; count: number };
};

// SAME IMPORTS...

export default function Managerdashboard() {
  const [analyticsData, setAnalyticsData] = useState<DayAnalytics[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayAnalytics | null>(null);
  const [summaryData, setSummaryData] = useState<DashboardSummary | null>(null);
  const [role, setRole] = useState<string>("");

  const fetchAnalytics = async () => {
    try {
      const today = new Date();
      const end = new Date();
      end.setDate(today.getDate() + 60);
      const format = (d: Date) => d.toISOString().split("T")[0];

      const res = await axiosInstance.get(
        `/leave/analytics?start=${format(today)}&end=${format(end)}`,
      );

      const data = res.data || [];
      setAnalyticsData(data);

      const todayStr = format(today);
      const todayData = data.find((d: DayAnalytics) => d.date === todayStr);
      if (todayData) setSelectedDay(todayData);
    } catch (error) {
      console.error("Analytics load failed", error);
    }
  };

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole) setRole(userRole);
    fetchAnalytics();
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const today = new Date();
        const res = await axiosInstance.get(
          `/dashboard/summary?year=${today.getFullYear()}&month=${today.getMonth() + 1}`,
        );
        setSummaryData(res.data);
      } catch (error) {
        console.error("Summary load failed", error);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="space-y-5 w-full p-4 bg-[#fcfdfe] min-h-screen">
      {/* SUMMARY */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-5 flex items-center gap-2">
          <div className="w-1 h-3 bg-indigo-600 rounded-full" /> Team Overview
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard
            label="Highest Leave Date"
            icon={<FiCalendar className="text-rose-500" />}
            value={
              summaryData
                ? `${summaryData.highest_leave_date.count} Resource.`
                : "-"
            }
            subText={summaryData?.highest_leave_date.date}
            highlight="text-rose-600"
          />

          <SummaryCard
            label={
              role === "MANAGER" ? "Highest Leave Team" : "Team Total Leave"
            }
            icon={<FiUsers className="text-purple-500" />}
            value={
              summaryData
                ? role === "MANAGER"
                  ? summaryData.team_highest_leave.team
                  : `${summaryData.team_total_leave} Days`
                : "-"
            }
            subText={
              role === "MANAGER"
                ? `(${summaryData?.team_highest_leave.count} days)`
                : ""
            }
            highlight="text-purple-600"
          />

          <SummaryCard
            label="Peak Leave Week"
            icon={<FiTrendingUp className="text-amber-500" />}
            value={
              summaryData
                ? `Week ${summaryData.peak_leave_week.week_number}`
                : "-"
            }
            subText={summaryData?.peak_leave_week.start}
            highlight="text-amber-600"
          />

          <SummaryCard
            label="Top Leave Taker"
            icon={<FiUser className="text-blue-500" />}
            value={summaryData ? summaryData.top_leave_taker.name : "-"}
            subText={
              summaryData ? `${summaryData.top_leave_taker.count} days` : ""
            }
            highlight="text-blue-600"
          />
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-5">
        {/* LEFT PANEL */}
        <div className="col-span-12 lg:col-span-4">
          <CardComp title="Daily Insight">
            {selectedDay ? (
              <div className="space-y-4">
                {/* HEADER */}
                <div className="bg-slate-900 rounded-xl p-4 text-white shadow">
                  <div className="flex justify-between items-center opacity-60 mb-1">
                    <p className="text-[9px] font-black uppercase tracking-wide">
                      Active Report
                    </p>
                    <FiClock size={12} />
                  </div>
                  <p className="text-lg font-black">{selectedDay.date}</p>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 gap-2">
                  <InfoCard
                    label="% On Leave"
                    value={`${selectedDay.leave_percentage.toFixed(1)}%`}
                    color={
                      selectedDay.leave_percentage > 8 ? "rose" : "default"
                    } // or any fallback color
                  />
                  <InfoCard
                    label="% Remaining"
                    value={`${selectedDay.remaining_allowed_percentage.toFixed(1)}%`}
                    color="amber"
                  />
                  <InfoCard
                    label="% Available"
                    value={`${selectedDay.available_percentage.toFixed(1)}%`}
                    color="emerald"
                  />
                  <InfoCard
                    label="Total Res."
                    value={selectedDay.total_resources}
                    color="slate"
                  />
                </div>

                {/* LIST 1 */}
                <div className="bg-slate-50 rounded-xl p-4 border">
                  <p className="text-[9px] font-black text-slate-400 mb-3 uppercase flex justify-between">
                    On Leave{" "}
                    <span className="text-rose-500">
                      {selectedDay.on_leave}
                    </span>
                  </p>

                  <ul className="space-y-2 max-h-32 overflow-y-auto pr-1">
                    {!selectedDay.employees_on_leave?.length ? (
                      <div className="text-center py-3 text-slate-300 text-[10px] italic">
                        No absences
                      </div>
                    ) : (
                      selectedDay.employees_on_leave.map((name, i) => (
                        <li
                          key={i}
                          className="bg-white border rounded-lg px-3 py-2 text-[11px] font-bold"
                        >
                          {name}
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {/* LIST 2 */}
                <div className="bg-slate-50 rounded-xl p-4 border">
                  <p className="text-[9px] font-black text-slate-400 mb-3 uppercase flex justify-between">
                    Pending{" "}
                    <span className="text-amber-500">
                      {selectedDay.employees_pending?.length || 0}
                    </span>
                  </p>

                  <ul className="space-y-2 max-h-32 overflow-y-auto pr-1">
                    {!selectedDay.employees_pending?.length ? (
                      <div className="text-center py-3 text-slate-300 text-[10px] italic">
                        Clean queue
                      </div>
                    ) : (
                      selectedDay.employees_pending.map((name, i) => (
                        <li
                          key={i}
                          className="bg-white border rounded-lg px-3 py-2 text-[11px] font-bold"
                        >
                          {name}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-slate-300">
                <FiClock size={24} className="opacity-20" />
                <p className="text-[10px] font-black uppercase">Select data</p>
              </div>
            )}
          </CardComp>
        </div>

        {/* CHART */}
        <div className="col-span-12 lg:col-span-8 flex">
          <div className="w-full bg-white rounded-2xl border p-4 shadow-sm">
            <WorkHoursChart
              analytics={analyticsData}
              onBarClick={(day) => setSelectedDay(day)}
              onRefresh={fetchAnalytics}
            />
          </div>
        </div>
      </div>

      <LeaveRequests />
    </div>
  );
}

/* INFO CARD */
function InfoCard({ label, value, color }: any) {
  const themes: any = {
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-50 text-slate-600",
  };

  return (
    <div className={`rounded-xl p-3 border text-center ${themes[color]}`}>
      <p className="text-[8px] font-black uppercase mb-1">{label}</p>
      <p className="text-sm font-black">{value}</p>
    </div>
  );
}

/* SUMMARY CARD */
function SummaryCard({ label, value, subText, icon, highlight }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow transition">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        <p className="text-[9px] font-black text-slate-400 uppercase">
          {label}
        </p>
      </div>

      <p className={`text-sm font-black ${highlight}`}>{value}</p>
      <p className="text-[9px] text-slate-400 truncate">
        {subText || "\u00A0"}
      </p>
    </div>
  );
}
