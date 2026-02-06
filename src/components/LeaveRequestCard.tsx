import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../components/ui/card";

type LeaveRequestProps = {
  employeeName: string;
  avatar: string;
  leaveType: string;
  status: "Pending" | "Approved" | "Rejected";
  from: string;
  to: string;
  days: number;
  onApprove?: () => void;
  onReject?: () => void;
};

export default function LeaveRequestCard({
  employeeName,
  avatar,
  leaveType,
  status,
  from,
  to,
  days,
  onApprove,
  onReject,
}: LeaveRequestProps) {
  return (
    <Card className="rounded-2xl">

      {/* HEADER */}
      <CardHeader className="flex-row items-center justify-between">
        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
          {leaveType}
        </span>

        <span className="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-600">
          {status}
        </span>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="space-y-4">

        {/* Employee */}
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={employeeName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold">{employeeName}</p>
            <p className="text-xs text-muted-foreground">
              Leave for {days} day(s)
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Leave From</p>
            <p className="font-medium">{from}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Leave To</p>
            <p className="font-medium">{to}</p>
          </div>
        </div>

      </CardContent>

      {/* FOOTER */}
      <CardFooter className="gap-3">
        <button
          onClick={onApprove}
          className="flex-1 border border-green-500 text-green-600 rounded-lg py-2 text-sm font-medium hover:bg-green-50"
        >
          Approve
        </button>

        <button
          onClick={onReject}
          className="flex-1 border border-red-500 text-red-600 rounded-lg py-2 text-sm font-medium hover:bg-red-50"
        >
          Reject
        </button>
      </CardFooter>

    </Card>
  );
}
