import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import type { DayAnalytics } from "../../shared/analytics";
import { useState } from "react";

type WorkHoursChartProps = {
  analytics: DayAnalytics[];
  onBarClick: (data: DayAnalytics) => void;
  onRefresh: () => void;
};

export default function WorkHoursChart({
  analytics,
  onBarClick,
  onRefresh,
}: WorkHoursChartProps) {
  const categories = analytics.map((d) => {
    const date = new Date(d.date);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  });
  const [rotate, setRotate] = useState(false);

  // const leaveData = analytics.map((d) => d.on_leave);

  const approvedData = analytics.map((d) => d.approved || 0);
  const pendingData = analytics.map((d) => d.pending || 0);
  const availableData = analytics.map(
    (d) => d.total_resources - (d.approved || 0) - d.pending,
  );

  const handleRefresh = () => {
    setRotate(true);
    onRefresh();

    setTimeout(() => setRotate(false), 600);
  };
  const options: Highcharts.Options = {
    chart: {
      type: "column",
      height: 276,
      spacing: [20, 20, 20, 20],
      marginRight: 30,
      scrollablePlotArea: {
        minWidth: analytics.length * 80,
        scrollPositionX: 0,
      },
    },

    title: { text: "" },

    xAxis: {
      categories,
      lineWidth: 0,
      tickWidth: 0,
      labels: {
        style: { fontSize: "11px", color: "#6B7280" },
        overflow: "justify",
      },
    },

    yAxis: {
      min: 0,
      gridLineDashStyle: "Dash",
      title: { text: undefined },
    },

    legend: {
      align: "right",
      verticalAlign: "top",
      layout: "horizontal",
      itemStyle: { fontSize: "12px" },
    },

    tooltip: {
      shared: true,
      formatter: function () {
        const ctx = this as any;
        if (!ctx.points || ctx.points.length === 0) return "";

        const index = ctx.points[0].point.index;
        const day = analytics[index];
        if (!day) return "";

        return `
  <b>${day.date}</b><br/>
  Approved: ${day.approved || 0}<br/>
  Pending: ${day.pending || 0}<br/>
  Available: ${
    day.total_resources - (day.approved || 0) - (day.pending || 0)
  }<br/>
  Leave %: ${Number(day.leave_percentage).toFixed(3)}%<br/>
`;
      },
    },

    plotOptions: {
      column: {
        stacking: "normal",
        borderRadius: 6,
        cursor: "pointer",
        groupPadding: 0.1,
        pointPadding: 0.05,
        point: {
          events: {
            click: function () {
              const index = this.index;
              const day = analytics[index];
              if (day) {
                onBarClick(day);
              }
            },
          },
        },
      },
    },

    credits: { enabled: false },

    series: [
      {
        type: "column",
        name: "Approved",
        data: approvedData,
        color: "#EC4899", // pink (clean, modern)
      },
      {
        type: "column",
        name: "Pending",
        data: pendingData,
        color: "#9CA3AF", // soft gray
      },
      {
        type: "column",
        name: "Available",
        data: availableData,
        color: "#3B82F6", // blue
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 w-full h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">Leave Resource Analytics</p>
        <button
          onClick={handleRefresh}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <span className={`inline-block ${rotate ? "animate-spin" : ""}`}>
            🔄
          </span>
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}
