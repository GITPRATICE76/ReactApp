import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

/* ================= PROPS TYPE ================= */
type WorkHoursChartProps = {
  CasualLeave: number[];
  OFFICE: number[];
  onBarClick: (data: {
    date: string;
    casualLeave: number;
    office: number;
  }) => void;
};

/* ================= COMPONENT ================= */
export default function WorkHoursChart({
  CasualLeave,
  OFFICE,
  onBarClick,
}: WorkHoursChartProps) {
  // 🔹 make categories match data length
  const daysCount = Math.max(CasualLeave.length, OFFICE.length);
  const categories = getNextDays(daysCount);

  // total hours calculation (optional header data)
  const totalMinutes =
    [...CasualLeave, ...OFFICE].reduce((a, b) => a + b, 0) * 60;
  const totalHrs = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;

  /* ================= CHART OPTIONS ================= */
  const options: Highcharts.Options = {
    chart: {
      type: "column",
      height: 260,
      spacing: [10, 10, 10, 10],
      scrollablePlotArea: {
        minWidth: daysCount * 70,
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
        cursor: "pointer",

        point: {
          events: {
            click: function () {
              const index = this.index;

              onBarClick({
                date: categories[index],
                casualLeave: CasualLeave[index] ?? 0,
                office: OFFICE[index] ?? 0,
              });
            },
          },
        },
      },
    },

    credits: { enabled: false },

    series: [
      {
        type: "column",
        name: "Casual Leave",
        data: CasualLeave,
        color: "#3B5BDB",
      },
      {
        type: "column",
        name: "Office",
        data: OFFICE,
        color: "#F4C7C3",
      },
    ],
  };

  /* ================= JSX ================= */
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 w-full h-full flex flex-col">
      {/* Header */}
      <div className="mb-2">
        <p className="text-sm text-gray-500">Member Work Hours</p>
        <p className="text-2xl font-semibold text-gray-900">
          {totalHrs}h {totalMins}m
        </p>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}

/* ================= HELPER FUNCTION ================= */
function getNextDays(count: number) {
  const days: string[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);

    days.push(
      d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      })
    );
  }

  return days;
}
