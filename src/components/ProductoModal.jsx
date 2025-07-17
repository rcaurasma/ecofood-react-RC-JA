import { useState } from 'react';
import { Modal } from "react-bootstrap";
import { addProducto, updateProducto } from '../services/productoService';
import Swal from "sweetalert2";
import PropTypes from 'prop-types';

ProductoModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
};

export default function ProductoModal({ 
  show, 
  setShow, 
  userData, 
  handleRefresh, 
  formData, 
  setFormData 
}) {
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);

  // Validar formulario
  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!formData.nombre || formData.nombre.trim().length < 2) {
      nuevosErrores.nombre = "El nombre debe tener al menos 2 caracteres";
    }
    
    if (!formData.descripcion || formData.descripcion.trim().length < 5) {
      nuevosErrores.descripcion = "La descripción debe tener al menos 5 caracteres";
    }
    
    if (formData.precio === undefined || formData.precio === null || formData.precio < 0) {
      nuevosErrores.precio = "El precio debe ser mayor o igual a 0";
    }
    
    if (!formData.cantidad || formData.cantidad < 1) {
      nuevosErrores.cantidad = "La cantidad debe ser mayor a 0";
    }
    
    if (!formData.vencimiento) {
      nuevosErrores.vencimiento = "La fecha de vencimiento es requerida";
    } else {
      const fechaVencimiento = new Date(formData.vencimiento);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Eliminar horas para comparar solo fechas
      
      if (fechaVencimiento < hoy) {
        nuevosErrores.vencimiento = "La fecha de vencimiento no puede ser anterior a hoy";
      }
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const productoData = {
        ...formData,
        precio: parseFloat(formData.precio) || 0,
        cantidad: parseInt(formData.cantidad) || 1,
        empresaId: userData.uid
      };
      
      if (formData.id) {
        await updateProducto(formData.id, productoData);
        await Swal.fire({
          title: "¡Producto actualizado!",
          text: "El producto se ha actualizado correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await addProducto(productoData);
        await Swal.fire({
          title: "¡Producto creado!",
          text: "El producto se ha creado correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      }
      
      handleRefresh();
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      await Swal.fire({
        title: "Error",
        text: "Hubo un problema al guardar el producto",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const cerrarModal = () => {
    setShow(false);
    setErrores({});
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Limpiar error del campo cuando el usuario empiece a corregir
    if (errores[field]) {
      setErrores({ ...errores, [field]: undefined });
    }
  };

  // Calcular el mínimo de fecha para vencimiento (hoy)
  const fechaMinima = new Date().toISOString().split('T')[0];

  return (
    <Modal
      show={show}
      onHide={cerrarModal}
      centered
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header>
        <Modal.Title>
          <i className={`fas ${formData.id ? 'fa-edit' : 'fa-plus'} me-2`}></i>
          {formData.id ? "Editar" : "Agregar"} Producto
        </Modal.Title>
      </Modal.Header>
      
      <form onSubmit={guardarProducto}>
        <Modal.Body>
          <div className="row g-3">
            {/* Nombre */}
            <div className="col-12">
              <label htmlFor="nombre" className="form-label">
                Nombre del producto <span className="text-danger">*</span>
              </label>
              <input 
                id="nombre"
                className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                type="text"
                placeholder="Ej: Tomates Cherry"
                value={formData.nombre || ''}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                maxLength={100}
              />
              {errores.nombre && (
                <div className="invalid-feedback">{errores.nombre}</div>
              )}
            </div>

            {/* Descripción */}
            <div className="col-12">
              <label htmlFor="descripcion" className="form-label">
                Descripción <span className="text-danger">*</span>
              </label>
              <textarea 
                id="descripcion"
                className={`form-control ${errores.descripcion ? 'is-invalid' : ''}`}
                placeholder="Describe tu producto..."
                value={formData.descripcion || ''}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                rows={3}
                maxLength={500}
              />
              {errores.descripcion && (
                <div className="invalid-feedback">{errores.descripcion}</div>
              )}
              <div className="form-text">
                {(formData.descripcion || '').length}/500 caracteres
              </div>
            </div>

            {/* Precio y Cantidad */}
            <div className="col-md-6">
              <label htmlFor="precio" className="form-label">
                Precio <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input 
                  id="precio"
                  className={`form-control ${errores.precio ? 'is-invalid' : ''}`}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.precio || ''}
                  onChange={(e) => handleInputChange('precio', e.target.value)}
                />
                {errores.precio && (
                  <div className="invalid-feedback">{errores.precio}</div>
                )}
              </div>
              {(formData.precio === 0 || formData.precio === "0") && (
                <div className="form-text text-success">
                  <i className="fas fa-gift me-1"></i>
                  Este producto será marcado como GRATUITO
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="cantidad" className="form-label">
                Cantidad disponible <span className="text-danger">*</span>
              </label>
              <input 
                id="cantidad"
                className={`form-control ${errores.cantidad ? 'is-invalid' : ''}`}
                type="number"
                min="1"
                placeholder="1"
                value={formData.cantidad || ''}
                onChange={(e) => handleInputChange('cantidad', e.target.value)}
              />
              {errores.cantidad && (
                <div className="invalid-feedback">{errores.cantidad}</div>
              )}
            </div>

            {/* Fecha de vencimiento */}
            <div className="col-12">
              <label htmlFor="vencimiento" className="form-label">
                Fecha de vencimiento <span className="text-danger">*</span>
              </label>
              <input 
                id="vencimiento"
                className={`form-control ${errores.vencimiento ? 'is-invalid' : ''}`}
                type="date"
                min={fechaMinima}
                value={formData.vencimiento || ''}
                onChange={(e) => handleInputChange('vencimiento', e.target.value)}
              />
              {errores.vencimiento && (
                <div className="invalid-feedback">{errores.vencimiento}</div>
              )}
              <div className="form-text">
                La fecha de vencimiento no puede ser anterior a hoy
              </div>
            </div>
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={cerrarModal}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              <>
                <i className="fas fa-save me-1"></i>
                {formData.id ? "Actualizar" : "Crear"} Producto
              </>
            )}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
