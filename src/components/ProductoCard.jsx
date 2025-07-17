import PropTypes from 'prop-types';

ProductoCard.propTypes = {
  producto: PropTypes.object.isRequired,
  onEditar: PropTypes.func.isRequired,
  onEliminar: PropTypes.func.isRequired,
};

export default function ProductoCard({ producto, onEditar, onEliminar }) {
  // Calcular días hasta vencimiento
  const calcularDiasVencimiento = (fechaVencimiento) => {
    if (!fechaVencimiento) return null;
    
    const hoy = new Date();
    const fechaVenc = new Date(fechaVencimiento);
    const diffTime = fechaVenc - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Obtener clase CSS según estado
  const obtenerClaseEstado = (estado) => {
    switch (estado) {
      case 'vencido':
        return 'border-danger';
      case 'por_vencer':
        return 'border-warning';
      case 'disponible':
        return 'border-success';
      default:
        return 'border-secondary';
    }
  };

  // Obtener texto del estado
  const obtenerTextoEstado = (estado) => {
    switch (estado) {
      case 'vencido':
        return 'Vencido';
      case 'por_vencer':
        return 'Por vencer';
      case 'disponible':
        return 'Disponible';
      default:
        return 'Sin estado';
    }
  };

  // Obtener clase del badge según estado
  const obtenerClaseBadge = (estado) => {
    switch (estado) {
      case 'vencido':
        return 'bg-danger';
      case 'por_vencer':
        return 'bg-warning text-dark';
      case 'disponible':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  const diasVencimiento = calcularDiasVencimiento(producto.vencimiento);
  const esGratuito = producto.precio === 0 || producto.precio === "0";
  
  return (
    <div className={`card h-100 ${obtenerClaseEstado(producto.estado)}`}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="card-title mb-0">{producto.nombre}</h6>
        <span className={`badge ${obtenerClaseBadge(producto.estado)}`}>
          {obtenerTextoEstado(producto.estado)}
        </span>
      </div>
      
      <div className="card-body">
        <p className="card-text text-muted small">{producto.descripcion}</p>
        
        <div className="row g-2 mb-3">
          <div className="col-6">
            <strong>Precio:</strong>
            <div className={`${esGratuito ? 'text-success fw-bold' : ''}`}>
              {esGratuito ? 'GRATUITO' : `$${producto.precio}`}
            </div>
          </div>
          <div className="col-6">
            <strong>Cantidad:</strong>
            <div>{producto.cantidad || 'N/A'}</div>
          </div>
        </div>
        
        {producto.vencimiento && (
          <div className="mb-3">
            <strong>Vencimiento:</strong>
            <div className="d-flex flex-column">
              <span>{new Date(producto.vencimiento).toLocaleDateString('es-ES')}</span>
              {diasVencimiento !== null && (
                <small className={`
                  ${diasVencimiento < 0 ? 'text-danger' : 
                    diasVencimiento <= 3 ? 'text-warning' : 'text-muted'}
                `}>
                  {diasVencimiento < 0 
                    ? `Venció hace ${Math.abs(diasVencimiento)} días`
                    : diasVencimiento === 0 
                    ? 'Vence hoy'
                    : diasVencimiento <= 3
                    ? `Vence en ${diasVencimiento} días`
                    : `Vence en ${diasVencimiento} días`
                  }
                </small>
              )}
            </div>
          </div>
        )}
        
        {/* Advertencia si vence pronto */}
        {diasVencimiento !== null && diasVencimiento <= 3 && diasVencimiento >= 0 && (
          <div className="alert alert-warning py-2 mb-3">
            <i className="fas fa-exclamation-triangle me-1"></i>
            <small>¡Producto próximo a vencer!</small>
          </div>
        )}
        
        {/* Advertencia si está vencido */}
        {diasVencimiento !== null && diasVencimiento < 0 && (
          <div className="alert alert-danger py-2 mb-3">
            <i className="fas fa-times-circle me-1"></i>
            <small>¡Producto vencido!</small>
          </div>
        )}
      </div>
      
      <div className="card-footer bg-transparent">
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary btn-sm flex-fill"
            onClick={() => onEditar(producto)}
          >
            <i className="fas fa-edit me-1"></i>Editar
          </button>
          <button 
            className="btn btn-outline-danger btn-sm flex-fill"
            onClick={() => onEliminar(producto.id)}
          >
            <i className="fas fa-trash me-1"></i>Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
