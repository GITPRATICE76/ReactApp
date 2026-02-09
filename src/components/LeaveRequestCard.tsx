import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../components/ui/card";

type LeaveRequestCardProps = {
  employeeName: string;

  avatar: string;

  leaveType: string;

  status: "PENDING" | "APPROVED" | "REJECTED";

  from: string;

  to: string;

  days: number;

  reason: string;

  isEditing?: boolean;

  onApprove: () => void;

  onReject: () => void;

  onEdit: () => void;
};

export default function LeaveRequestCard({
  employeeName,

  avatar,

  leaveType,

  status,

  from,

  to,

  days,

  reason,

  isEditing,

  onApprove,

  onReject,

  onEdit,
}: LeaveRequestCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex-row items-center justify-between">
        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
          {leaveType}
        </span>
        <span className="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-600">
          {status}
        </span>
      </CardHeader>

      <CardContent className="space-y-4">
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

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="font-medium">{from}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">To</p>
            <p className="font-medium">{to}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Reason</p>
          <p className="font-medium">{reason}</p>
        </div>
      </CardContent>

      <CardFooter className="gap-3">
        {status === "PENDING" || isEditing ? (
          <>
            <button
              onClick={onApprove}
              className="flex-1 border border-green-500 text-green-600 rounded-lg py-2 text-sm"
            >
              Approve
            </button>

            <button
              onClick={onReject}
              className="flex-1 border border-red-500 text-red-600 rounded-lg py-2 text-sm"
            >
              Reject
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}
            className="flex-1 border border-blue-500 text-blue-600 rounded-lg py-2 text-sm"
          >
            Edit
          </button>
        )}
      </CardFooter>
    </Card>
  );
}
