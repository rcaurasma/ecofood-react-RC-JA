import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  // Solo permite acceso si el usuario está autenticado y su correo está verificado
  return user && user.emailVerified ? children : <Navigate to="/login" />;
}
