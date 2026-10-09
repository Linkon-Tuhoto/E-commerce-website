
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function AdminRoute() {
  const location = useLocation();

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("surveyToken") ||
    localStorage.getItem("authToken");

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  if (!token || !user) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
