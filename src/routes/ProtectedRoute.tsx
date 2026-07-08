import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import type { Role } from "@/types";

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: Role[] }) {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"} replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  if (isAuthenticated && user) {
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"} replace />;
  }
  return <Outlet />;
}
