import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === "therapist") return <Navigate to="/therapist" replace />;
  return <Navigate to="/dashboard" replace />;
};

export default Index;
