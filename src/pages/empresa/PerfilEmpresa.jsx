import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obtenerEmpresaPorUID, actualizarPerfilEmpresa, validarPerfilEmpresa } from '../../services/empresaService';
import Swal from 'sweetalert2';

export default function PerfilEmpresa() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [datosEmpresa, setDatosEmpresa] = useState({
    nombre: '',
    rut: '',
    correo: '',
    telefono: '',
    direccion: '',
    descripcion: '',
    fechaCreacion: '',
    fechaActualizacion: ''
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    const cargarDatos = async () => {
      if (!userData?.uid) return;
      
      try {
        setLoading(true);
        const empresa = await obtenerEmpresaPorUID(userData.uid);
        setDatosEmpresa(empresa);
      } catch (error) {
        console.error('Error al cargar datos de empresa:', error);
        await Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los datos de la empresa',
          icon: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, [userData]);

  const cargarDatosEmpresa = async () => {
    if (!userData?.uid) return;
    
    try {
      setLoading(true);
      const empresa = await obtenerEmpresaPorUID(userData.uid);
      setDatosEmpresa(empresa);
    } catch (error) {
      console.error('Error al cargar datos de empresa:', error);
      await Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los datos de la empresa',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setDatosEmpresa({ ...datosEmpresa, [field]: value });
    
    // Limpiar error del campo
    if (errores[field]) {
      setErrores({ ...errores, [field]: undefined });
    }
  };

  const handleGuardar = async () => {
    const validacion = validarPerfilEmpresa(datosEmpresa);
    
    if (!validacion.esValido) {
      setErrores(validacion.errores);
      return;
    }

    setGuardando(true);
    
    try {
      await actualizarPerfilEmpresa(datosEmpresa.id, datosEmpresa);
      
      await Swal.fire({
        title: '¡Perfil actualizado!',
        text: 'Los datos de tu empresa se han actualizado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      
      setModoEdicion(false);
      setErrores({});
      
      // Recargar datos para obtener fechaActualizacion actualizada
      await cargarDatosEmpresa();
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      await Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al actualizar el perfil',
        icon: 'error'
      });
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelar = () => {
    setModoEdicion(false);
    setErrores({});
    cargarDatosEmpresa(); // Recargar datos originales
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted">Cargando datos de la empresa...</p>
          </div>
        </div>
      </div>
    );
  }

  return (      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Encabezado con botón de regreso */}
            <div className="d-flex justify-content-between align-items-center mb-4">

              <h2>Perfil de Empresa</h2>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => navigate("/empresa/dashboard")}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Regresar al Dashboard
              </button>
            </div>

            
            
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">
                    <i className="fas fa-building me-2"></i>
                    Información de la Empresa
                  </h4>
                  {!modoEdicion && (
                    <button 
                      className="btn btn-light btn-sm"
                      onClick={() => setModoEdicion(true)}
                    >
                      <i className="fas fa-edit me-1"></i>
                      Editar Perfil
                    </button>
                  )}
                </div>
              </div>
            
            <div className="card-body">
              <div className="row g-3">
                {/* Nombre de la empresa */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Nombre de la empresa</label>
                  {modoEdicion ? (
                    <>
                      <input
                        type="text"
                        className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                        value={datosEmpresa.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        placeholder="Nombre de la empresa"
                        maxLength={100}
                      />
                      {errores.nombre && (
                        <div className="invalid-feedback">{errores.nombre}</div>
                      )}
                    </>
                  ) : (
                    <p className="form-control-plaintext">{datosEmpresa.nombre || 'No especificado'}</p>
                  )}
                </div>

                {/* RUT (no editable) */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">RUT</label>
                  <p className="form-control-plaintext text-muted">
                    {datosEmpresa.rut || 'No especificado'}
                    <small className="d-block">No editable</small>
                  </p>
                </div>

                {/* Correo (no editable) */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Correo electrónico</label>
                  <p className="form-control-plaintext text-muted">
                    {datosEmpresa.correo || 'No especificado'}
                    <small className="d-block">No editable</small>
                  </p>
                </div>

                {/* Teléfono */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Teléfono</label>
                  {modoEdicion ? (
                    <>
                      <input
                        type="tel"
                        className={`form-control ${errores.telefono ? 'is-invalid' : ''}`}
                        value={datosEmpresa.telefono}
                        onChange={(e) => handleInputChange('telefono', e.target.value)}
                        placeholder="Ej: +56 9 1234 5678"
                        maxLength={20}
                      />
                      {errores.telefono && (
                        <div className="invalid-feedback">{errores.telefono}</div>
                      )}
                    </>
                  ) : (
                    <p className="form-control-plaintext">{datosEmpresa.telefono || 'No especificado'}</p>
                  )}
                </div>

                {/* Dirección */}
                <div className="col-12">
                  <label className="form-label fw-bold">Dirección</label>
                  {modoEdicion ? (
                    <>
                      <input
                        type="text"
                        className={`form-control ${errores.direccion ? 'is-invalid' : ''}`}
                        value={datosEmpresa.direccion}
                        onChange={(e) => handleInputChange('direccion', e.target.value)}
                        placeholder="Dirección completa"
                        maxLength={200}
                      />
                      {errores.direccion && (
                        <div className="invalid-feedback">{errores.direccion}</div>
                      )}
                    </>
                  ) : (
                    <p className="form-control-plaintext">{datosEmpresa.direccion || 'No especificado'}</p>
                  )}
                </div>

                {/* Descripción */}
                <div className="col-12">
                  <label className="form-label fw-bold">Descripción de la empresa</label>
                  {modoEdicion ? (
                    <>
                      <textarea
                        className={`form-control ${errores.descripcion ? 'is-invalid' : ''}`}
                        value={datosEmpresa.descripcion}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        placeholder="Describe tu empresa, productos y servicios..."
                        rows={4}
                        maxLength={1000}
                      />
                      {errores.descripcion && (
                        <div className="invalid-feedback">{errores.descripcion}</div>
                      )}
                      <div className="form-text">
                        {(datosEmpresa.descripcion || '').length}/1000 caracteres
                      </div>
                    </>
                  ) : (
                    <p className="form-control-plaintext" style={{ whiteSpace: 'pre-wrap' }}>
                      {datosEmpresa.descripcion || 'No especificado'}
                    </p>
                  )}
                </div>

                {/* Información de fechas */}
                {(datosEmpresa.fechaCreacion || datosEmpresa.fechaActualizacion) && (
                  <div className="col-12">
                    <hr />
                    <div className="row">
                      {datosEmpresa.fechaCreacion && (
                        <div className="col-md-6">
                          <label className="form-label fw-bold text-muted">Fecha de registro</label>
                          <p className="form-control-plaintext small text-muted">
                            {new Date(datosEmpresa.fechaCreacion).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                      {datosEmpresa.fechaActualizacion && (
                        <div className="col-md-6">
                          <label className="form-label fw-bold text-muted">Última actualización</label>
                          <p className="form-control-plaintext small text-muted">
                            {new Date(datosEmpresa.fechaActualizacion).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de acción en modo edición */}
              {modoEdicion && (
                <div className="d-flex gap-2 mt-4 pt-3 border-top">
                  <button
                    className="btn btn-success"
                    onClick={handleGuardar}
                    disabled={guardando}
                  >
                    {guardando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-1"></i>
                        Guardar Cambios
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelar}
                    disabled={guardando}
                  >
                    <i className="fas fa-times me-1"></i>
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
