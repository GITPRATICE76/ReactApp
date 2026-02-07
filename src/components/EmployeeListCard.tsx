import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../components/ui/card";

type Employee = {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  avatar?: string;
};

export default function EmployeeListCard() {
  const employees: Employee[] = [
  {
    id: 1,
    name: "Brooklyn Simmons",
    email: "brooklyn.simmons@mail.com",
    department: "Design",
    role: "UI Designer",
  },
  {
    id: 2,
    name: "Cody Fisher",
    email: "cody.fisher@mail.com",
    department: "Development",
    role: "Front-End Developer",
  },
  {
    id: 3,
    name: "Ralph Edwards",
    email: "ralph.edwards@mail.com",
    department: "Design",
    role: "UX Designer",
  },
  {
    id: 4,
    name: "Esther Howard",
    email: "esther.howard@mail.com",
    department: "HR",
    role: "HR Manager",
  },
  {
    id: 5,
    name: "Dianne Russell",
    email: "dianne.russell@mail.com",
    department: "Finance",
    role: "Accounts Executive",
  },
  {
    id: 6,
    name: "Albert Flores",
    email: "albert.flores@mail.com",
    department: "Development",
    role: "Backend Developer",
  },
  {
    id: 7,
    name: "Savannah Nguyen",
    email: "savannah.nguyen@mail.com",
    department: "Design",
    role: "Product Designer",
  },
  {
    id: 8,
    name: "Jerome Bell",
    email: "jerome.bell@mail.com",
    department: "QA",
    role: "Test Engineer",
  },
  {
    id: 9,
    name: "Kristin Watson",
    email: "kristin.watson@mail.com",
    department: "Marketing",
    role: "Marketing Specialist",
  },
  {
    id: 10,
    name: "Courtney Henry",
    email: "courtney.henry@mail.com",
    department: "Support",
    role: "Customer Support",
  },
  ];

  return (
    <Card className="rounded-2xl">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">
          Employee
        </CardTitle>

        <button className="text-sm text-indigo-600 border px-3 py-1 rounded-lg hover:bg-indigo-50">
          See Details
        </button>
      </CardHeader>

      {/* Table */}
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 text-xs text-gray-500 px-2 py-2 bg-gray-50 rounded-md">
          <span>Employee Name</span>
          <span>Department</span>
          <span>Job Title</span>
        </div>

        <div className="divide-y">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="grid grid-cols-3 items-center px-2 py-3 text-sm"
            >
              {/* Name */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{emp.name}</p>
                  <p className="text-xs text-gray-500">{emp.email}</p>
                </div>
              </div>

              {/* Department */}
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium w-fit
                  ${
                    emp.department === "Design"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
              >
                ● {emp.department}
              </span>

              {/* Role */}
              <span className="text-gray-700">{emp.role}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
