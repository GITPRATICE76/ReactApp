import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  role: "MANAGER" | "EMPLOYEE" | "RO";
}

export default function ProtectedRoute({ children, role }: Props) {
  const userRole = localStorage.getItem("role");

  if (!userRole) return <Navigate to="/" replace />;
  if (userRole !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
}
