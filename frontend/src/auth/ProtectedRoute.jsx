import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import LoadingState from "../components/LoadingState";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <LoadingState message="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
