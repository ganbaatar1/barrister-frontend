// 📁 src/components/PrivateRoute.jsx
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children }) {
  const { user } = useAuth?.() || {};
  const loc = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  // children байвал түүнийг, үгүй бол Outlet-ыг буцаана
  return children ? children : <Outlet />;
}
