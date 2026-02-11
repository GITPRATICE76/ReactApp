import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import type { DayAnalytics } from "../../shared/analytics";

/* ================= PROPS ================= */

type WorkHoursChartProps = {
  analytics: DayAnalytics[];
  onBarClick: (data: DayAnalytics) => void;
};

/* ================= COMPONENT ================= */

export default function WorkHoursChart({
  analytics,
  onBarClick,
}: WorkHoursChartProps) {

  const categories = analytics.map((d) => d.date);
  const leaveData = analytics.map((d) => d.on_leave);
  const availableData = analytics.map(
    (d) => d.total_resources - d.on_leave
  );

  const options: Highcharts.Options = {
    chart: {
      type: "column",
      height: 300,
      spacing: [10, 10, 10, 10],
      scrollablePlotArea: {
        minWidth: analytics.length * 70,
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

    /* ================= SAFE TOOLTIP ================= */

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
      On Leave: ${day.on_leave}<br/>
      Available: ${day.total_resources - day.on_leave}<br/>
      Leave %: ${day.leave_percentage.toFixed(1)}%<br/>
      Available %: ${day.available_percentage.toFixed(1)}%
    `;
  },
},


    plotOptions: {
      column: {
        stacking: "normal",
        borderRadius: 6,
        cursor: "pointer",

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
        name: "On Leave",
        data: leaveData,
        color: "#3B5BDB",
      },
      {
        type: "column",
        name: "Available",
        data: availableData,
        color: "#F4C7C3",
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 w-full h-full flex flex-col">

      <div className="mb-4">
        <p className="text-sm text-gray-500">Leave Resource Analytics</p>
        <p className="text-lg font-semibold text-gray-900">
          Dynamic Workforce Overview
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>

    </div>
  );
}
