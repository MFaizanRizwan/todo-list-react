import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  if (!user || !localStorage.getItem("authToken")) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const role = localStorage.getItem("userRole");

  if (!role || (allowedRoles && !allowedRoles.includes(role))) {
    return role === "admin" ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;