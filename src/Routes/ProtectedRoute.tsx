import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface Props {
  children: ReactNode;
  roles: Array<"MANAGER" | "EMPLOYEE" | "RO">;
}

interface MyToken {
  id: number;
  name: string;
  role: "MANAGER" | "EMPLOYEE" | "RO";
  exp: number;
}

export default function ProtectedRoute({ children, roles }: Props) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" replace />;

  try {
    const decoded = jwtDecode<MyToken>(token);

    if (!roles.includes(decoded.role)) {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  } catch {
    return <Navigate to="/" replace />;
  }
}
