import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function PublicRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-300">
        Chargement...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
