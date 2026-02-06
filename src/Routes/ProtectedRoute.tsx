import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  roles: Array<"MANAGER" | "EMPLOYEE" | "RO">;
}

export default function ProtectedRoute({ children, roles }: Props) {
  const userRole = localStorage.getItem("role") as
    | "MANAGER"
    | "EMPLOYEE"
    | "RO"
    | null;

  if (!userRole) return <Navigate to="/" replace />;

  if (!roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
