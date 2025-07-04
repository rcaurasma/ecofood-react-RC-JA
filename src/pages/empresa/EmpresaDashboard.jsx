import { useNavigate } from "react-router-dom";
import CerrarSesion from "../../components/CerrarSesion";

export default function EmpresaDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard de Empresa</h2>
        <CerrarSesion />
      </div>
      
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-box me-2"></i>Productos
              </h5>
              <p className="card-text">Gestiona tus productos y servicios</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate("/empresa/productos")}
              >
                Ver Productos
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-shopping-cart me-2"></i>Pedidos
              </h5>
              <p className="card-text">Consulta los pedidos recibidos</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate("/empresa/pedidos")}
              >
                Ver Pedidos
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-user-cog me-2"></i>Perfil
              </h5>
              <p className="card-text">Actualiza la información de tu empresa</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate("/empresa/perfil")}
              >
                Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
