import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function ProtectedByRole({ allowed, children }) {
const { userData, loading } = useAuth();
if (loading) return <p>Cargando...</p>;
if (!userData || !allowed.includes(userData.tipo)) {
return <Navigate to="/login" />;
}
return children;
}