import CerrarSesion from "../../components/CerrarSesion";
import { useNavigate } from "react-router-dom";

export default function ClienteDashboard() {
  const navigate = useNavigate();

  const handleVerProductos = () => {
    navigate("/home");
  };

  return (
    <div className="container mt-4">
      <h2>Bienvenido cliente</h2>
      <div className="mb-3">
        <button 
          className="btn btn-primary me-2"
          onClick={handleVerProductos}
        >
          Ver productos
        </button>
      </div>
      <div className="navbar-nav">
        <CerrarSesion />
      </div>
    </div>
  );
}