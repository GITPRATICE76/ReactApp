import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import type { DayAnalytics } from "../../shared/analytics";

type WorkHoursChartProps = {
  analytics: DayAnalytics[];
  onBarClick: (data: DayAnalytics) => void;
};

export default function WorkHoursChart({
  analytics,
  onBarClick,
}: WorkHoursChartProps) {

  const categories = analytics.map((d) => {
    const date = new Date(d.date);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  });

  const leaveData = analytics.map((d) => d.on_leave);
  const availableData = analytics.map(
    (d) => d.total_resources - d.on_leave
  );

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
          On Leave: ${day.on_leave}<br/>
          Available: ${day.total_resources - day.on_leave}<br/>
          Leave %: ${Number(day.leave_percentage).toFixed(3)}%<br/>
          Available %: ${Number(day.available_percentage).toFixed(3)}%
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
        name: "On Leave",
        data: leaveData,
        color: "#F4C7C3",
      },
      {
        type: "column",
        name: "Available",
        data: availableData,
        color: "#1e40af",
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
