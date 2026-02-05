import BarChart from "../components/ui/BarChart";
import CardComp from "../components/ui/CardComp";

export default function Managerdashboard() {
  return (
    <div>
      <CardComp
        title="Member Work Hours"
        subtitle="Last 5 days performance"
        rightContent={
          <button className="text-sm font-medium text-blue-600 hover:underline">
            View Report
          </button>
        }
        children={undefined}
      ></CardComp>
      <BarChart
        title="Employees by Department"
        categories={["Feb5", "Feb6", "Feb6", "Feb7", "Feb8"]}
        data={[12, 8, 5, 4, 6]}
      />
      <h1 className="text-3xl p-10">Manager Dashboard</h1>
    </div>
  );
}
