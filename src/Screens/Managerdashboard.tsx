import WorkHoursChart from "../components/ui/BarChart";
import BarChart from "../components/ui/BarChart";
import CardComp from "../components/ui/CardComp";

export default function Managerdashboard() {
  return (
    <div>
      <CardComp
        title="What’s on in January?"
        rightContent={
          <div className="flex bg-gray-100 rounded-lg p-1 text-sm">
           
          </div>
        }
        children={undefined}
      ></CardComp>

      <WorkHoursChart
        CasualLeave={[8, 7, 5, 6, 7, 0, 0]}
        OFFICE={[1, 0, 2, 0, 1, 0, 0]}
      />

      <h1 className="text-3xl p-10">Manager Dashboard</h1>
    </div>
  );
}
