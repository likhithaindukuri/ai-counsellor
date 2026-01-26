import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const userId = localStorage.getItem("userId");
  return userId ? children : <Navigate to="/login" />;
}
