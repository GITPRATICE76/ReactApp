import { useState } from "react";
import WorkHoursChart from "../components/ui/BarChart";
import CardComp from "../components/ui/CardComp";
import EmployeeListCard from "../components/EmployeeListCard";

type SelectedBar = {
  date: string;
  casualLeave: number;
  office: number;
} | null;

export default function Managerdashboard() {
  const [selectedBar, setSelectedBar] = useState<SelectedBar>(null);

  return (
    <div className="space-y-6 w-full">

      {/* 🔝 TOP SUMMARY CARD */}
       <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold">Team Overview</h2>
        <p className="text-sm text-gray-500 mt-1">
          Monthly productivity and attendance summary
        </p>

        
      </div>

      {/* ⬇️ LEFT CARD + RIGHT CHART */}
      <div className="grid grid-cols-12 gap-6 w-full">

        {/* LEFT DETAILS CARD */}
        <div className="col-span-12 lg:col-span-3">
          <CardComp title="Selected Day Details">
            {selectedBar ? (
              <div className="space-y-4">
                <Detail label="Date" value={selectedBar.date} />
                <Detail
                  label="Casual Leave Hours"
                  value={`${selectedBar.casualLeave}h`}
                />
                <Detail
                  label="Office Hours"
                  value={`${selectedBar.office}h`}
                />
              </div>
            ) : (
              <div className="text-gray-400 text-sm h-[200px] flex items-center justify-center">
                Click a bar to view details
              </div>
            )}
          </CardComp>
        </div>

        {/* RIGHT BAR CHART */}
        <div className="col-span-12 lg:col-span-9">
          <WorkHoursChart
            CasualLeave={[8, 7, 5, 6, 7, 0, 0]}
            OFFICE={[1, 0, 2, 0, 1, 0, 0]}
            onBarClick={setSelectedBar}
          />
        </div>

      </div>
      <EmployeeListCard />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
