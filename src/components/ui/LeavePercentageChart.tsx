import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  leave: number;
  available: number;
};

export default function LeavePercentageChart({
  leave,
  available,
}: Props) {
  const data = [
    { name: "On Leave", value: leave },
    { name: "Available", value: available },
  ];

  const COLORS = ["#ef4444", "#2563eb"]; // red + blue

  return (
    <div className="bg-white rounded-xl p-6 border shadow-sm h-full">
      <h3 className="text-sm font-semibold mb-4 text-center">
        Resource Availability (%)
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={80}
            outerRadius={110}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip
  formatter={(value) => {
    if (typeof value === "number") {
      return `${value.toFixed(2)}%`;
    }
    return value;
  }}
/>
        </PieChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full" />
          On Leave
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-blue-600 rounded-full" />
          Available
        </div>
      </div>
    </div>
  );
}