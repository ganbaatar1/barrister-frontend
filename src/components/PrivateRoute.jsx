import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const PrivateRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Уншиж байна...</div>;

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
