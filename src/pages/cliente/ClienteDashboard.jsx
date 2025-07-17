import CerrarSesion from "../../components/CerrarSesion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ClienteDashboard() {
  const navigate = useNavigate();
  const { userData } = useAuth();

  const handleVerProductos = () => {
    navigate("/home");
  };

  const handleEditarPerfil = () => {
    // TODO: Implementar navegación a editar perfil
    console.log("Editar perfil - función futura");
  };

  const handleHacerPedido = () => {
    // TODO: Implementar navegación a hacer pedido
    console.log("Hacer pedido - función futura");
  };

  const handleVerOrdenes = () => {
    // TODO: Implementar navegación a ver órdenes
    console.log("Ver órdenes - función futura");
  };

  const handleHistorialCompras = () => {
    // TODO: Implementar navegación a historial de compras
    console.log("Historial de compras - función futura");
  };

  const handleConfiguracion = () => {
    // TODO: Implementar navegación a configuración
    console.log("Configuración - función futura");
  };

  return (
    <div className="container-fluid mt-4">
      {/* Header con saludo personalizado */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="text-success mb-1">
                <i className="fas fa-leaf me-2"></i>
                Bienvenido, {userData?.nombre || 'Cliente'}
              </h2>
              <p className="text-muted">Panel de control del cliente EcoFood</p>
            </div>
            <div>
              <CerrarSesion />
            </div>
          </div>
        </div>
      </div>

      {/* Grid de tarjetas funcionales */}
      <div className="row g-4">
        {/* Tarjeta 1: Ver Productos */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body text-center p-4">
              <div className="mb-3">
                <i className="fas fa-store text-success" style={{fontSize: '3rem'}}></i>
              </div>
              <h5 className="card-title text-dark">Ver Productos</h5>
              <p className="card-text text-muted">
                Explora nuestro catálogo de productos ecológicos y sustentables
              </p>
              <button 
                className="btn btn-success w-100"
                onClick={handleVerProductos}
              >
                <i className="fas fa-shopping-bag me-2"></i>
                Explorar Catálogo
              </button>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Hacer Pedido */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body text-center p-4">
              <div className="mb-3">
                <i className="fas fa-cart-plus text-primary" style={{fontSize: '3rem'}}></i>
              </div>
              <h5 className="card-title text-dark">Hacer Pedido</h5>
              <p className="card-text text-muted">
                Realiza un nuevo pedido de productos frescos y ecológicos
              </p>
              <button 
                className="btn btn-primary w-100"
                onClick={handleHacerPedido}
                disabled
              >
                <i className="fas fa-plus-circle me-2"></i>
                Nuevo Pedido
              </button>
              <small className="text-muted d-block mt-2">Próximamente</small>
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Mis Órdenes */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body text-center p-4">
              <div className="mb-3">
                <i className="fas fa-list-alt text-warning" style={{fontSize: '3rem'}}></i>
              </div>
              <h5 className="card-title text-dark">Mis Órdenes</h5>
              <p className="card-text text-muted">
                Revisa el estado de tus pedidos actuales y pendientes
              </p>
              <button 
                className="btn btn-warning w-100"
                onClick={handleVerOrdenes}
                disabled
              >
                <i className="fas fa-clipboard-list me-2"></i>
                Ver Órdenes
              </button>
              <small className="text-muted d-block mt-2">Próximamente</small>
            </div>
          </div>
        </div>

        {/* Tarjeta 4: Editar Perfil */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body text-center p-4">
              <div className="mb-3">
                <i className="fas fa-user-edit text-info" style={{fontSize: '3rem'}}></i>
              </div>
              <h5 className="card-title text-dark">Editar Perfil</h5>
              <p className="card-text text-muted">
                Actualiza tu información personal y preferencias
              </p>
              <button 
                className="btn btn-info w-100"
                onClick={handleEditarPerfil}
                disabled
              >
                <i className="fas fa-edit me-2"></i>
                Editar Información
              </button>
              <small className="text-muted d-block mt-2">Próximamente</small>
            </div>
          </div>
        </div>

        {/* Tarjeta 5: Historial de Compras */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body text-center p-4">
              <div className="mb-3">
                <i className="fas fa-history text-secondary" style={{fontSize: '3rem'}}></i>
              </div>
              <h5 className="card-title text-dark">Historial de Compras</h5>
              <p className="card-text text-muted">
                Consulta todas tus compras anteriores y facturas
              </p>
              <button 
                className="btn btn-secondary w-100"
                onClick={handleHistorialCompras}
                disabled
              >
                <i className="fas fa-file-alt me-2"></i>
                Ver Historial
              </button>
              <small className="text-muted d-block mt-2">Próximamente</small>
            </div>
          </div>
        </div>

        {/* Tarjeta 6: Configuración */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body text-center p-4">
              <div className="mb-3">
                <i className="fas fa-cog text-dark" style={{fontSize: '3rem'}}></i>
              </div>
              <h5 className="card-title text-dark">Configuración</h5>
              <p className="card-text text-muted">
                Ajusta tus preferencias y configuración de cuenta
              </p>
              <button 
                className="btn btn-dark w-100"
                onClick={handleConfiguracion}
                disabled
              >
                <i className="fas fa-cogs me-2"></i>
                Configurar
              </button>
              <small className="text-muted d-block mt-2">Próximamente</small>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="alert alert-success" role="alert">
            <i className="fas fa-info-circle me-2"></i>
            <strong>¡Bienvenido a EcoFood!</strong> Tu plataforma para productos ecológicos y sustentables. 
            Explora nuestro catálogo y contribuye a un mundo más verde.
          </div>
        </div>
      </div>
    </div>
  );
}