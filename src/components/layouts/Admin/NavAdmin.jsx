import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import CerrarSesion from "../../CerrarSesion";

export default function NavAdmin() {
  const { userData } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/admin/dashboard">
          <i className="fas fa-leaf me-2"></i>EcoFood Admin - {userData?.nombre}
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                to="/admin/dashboard"
              >
                <i className="fas fa-tachometer-alt me-1"></i>Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/admin/clientes') ? 'active' : ''}`}
                to="/admin/clientes"
              >
                <i className="fas fa-users me-1"></i>Clientes
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/admin/empresas') ? 'active' : ''}`}
                to="/admin/empresas"
              >
                <i className="fas fa-box me-1"></i>Empresas
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/admin/administradores') ? 'active' : ''}`}
                to="/admin/administradores"
              >
                <i className="fas fa-user-shield me-1"></i>Administradores
              </Link>
            </li>
          </ul>
          
          <div className="navbar-nav">
            <CerrarSesion />
          </div>
        </div>
      </div>
    </nav>
  );
}