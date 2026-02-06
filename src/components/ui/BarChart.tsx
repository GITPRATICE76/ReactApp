import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type WorkHoursChartProps = {
  CasualLeave: number[];
  OFFICE: number[];
};

export default function WorkHoursChart({
  CasualLeave,
  OFFICE,
}: WorkHoursChartProps) {
  const categories = getNext7Days();

  const totalMinutes =
    [...CasualLeave, ...OFFICE].reduce((a, b) => a + b, 0) * 60;
  const totalHrs = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;

  const options: Highcharts.Options = {
    chart: {
      type: "column",
      height: 260,
      spacing: [10, 10, 10, 10],
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
      labels: { enabled: false },
    },

    legend: {
      align: "right",
      verticalAlign: "top",
      layout: "horizontal",
      itemStyle: { fontSize: "12px" },
    },

    tooltip: {
      shared: true,
      pointFormat: "<b>{series.name}</b>: {point.y}h<br/>",
    },

    plotOptions: {
      column: {
        stacking: "normal",
        borderRadius: 6,
        pointPadding: 0.2,
        groupPadding: 0.1,
      },
    },

    credits: { enabled: false },

    series: [
      {
        type: "column",
        name: "Casual Lave",
        data: CasualLeave,
        color: "#3B5BDB",
      },
      {
        type: "column",
        name: "Office",
        data: CasualLeave,
        color: "#F4C7C3",
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 w-full max-w-sm aspect-square flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm text-gray-500">Member Work Hours</p>
          <p className="text-2xl font-semibold text-gray-900">
            {totalHrs}h {totalMins}m
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}
function getNext7Days() {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);

    const label = d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });

    days.push(label);
  }

  return days;
}
