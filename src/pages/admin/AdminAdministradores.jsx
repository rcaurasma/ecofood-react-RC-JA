import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import {
  getAdministradores,
  updateAdministrador,
  deleteAdministrador,
  registrarAdminConAuth
} from "../../services/adminFirebase";
import { AuthContext } from "../../context/AuthContext";

export default function AdminAdministradores() {
  const { user } = useContext(AuthContext); // Obtener usuario logueado
  
  const [administradores, setAdministradores] = useState([]);
  const [adminActivo, setAdminActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "" });

  const cargarAdministradores = async () => {
    try {
      const data = await getAdministradores();
      setAdministradores(data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los administradores", "error");
    }
  };

  const validarFormulario = () => {
    if (!formData.nombre || formData.nombre.length < 2) {
      Swal.fire("Error", "El nombre debe tener al menos 2 caracteres", "warning");
      return false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      Swal.fire("Error", "Ingrese un correo electrónico válido", "warning");
      return false;
    }
    if (!adminActivo && (!formData.password || formData.password.length < 6)) {
      Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres", "warning");
      return false;
    }
    return true;
  };

  const guardar = async () => {
    if (!validarFormulario()) return;

    try {
      if (adminActivo) {
        // Editar administrador existente (sin cambiar contraseña)
        // eslint-disable-next-line no-unused-vars
        const { password, ...dataWithoutPassword } = formData;
        await updateAdministrador(adminActivo.id, dataWithoutPassword);
        Swal.fire("Éxito", "Administrador actualizado correctamente", "success");
      } else {
        // Crear nuevo administrador
        await registrarAdminConAuth(formData);
        Swal.fire("Éxito", "Administrador creado. Se envió un correo de verificación.", "success");
      }
      
      setShowModal(false);
      setFormData({ nombre: "", email: "", password: "" });
      setAdminActivo(null);
      cargarAdministradores();
    } catch (error) {
      console.error("Error al guardar:", error);
      if (error.code === 'auth/email-already-in-use') {
        Swal.fire("Error", "Este correo electrónico ya está registrado", "error");
      } else {
        Swal.fire("Error", "No se pudo guardar el administrador", "error");
      }
    }
  };

  // Eliminación segura - evita que un admin se elimine a sí mismo
  const eliminar = async (id, nombre) => {
    const adminAEliminar = administradores.find(a => a.id === id);

    // Verificar que el admin no se elimine a sí mismo
    if (user && adminAEliminar?.email === user.email) {
      Swal.fire("Error", "No puedes eliminar tu propio usuario", "error");
      return;
    }

    const result = await Swal.fire({
      title: `¿Eliminar administrador "${nombre}"?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await deleteAdministrador(id);
        Swal.fire("Eliminado", "Administrador eliminado correctamente", "success");
        cargarAdministradores();
      } catch {
        Swal.fire("Error", "No se pudo eliminar el administrador", "error");
      }
    }
  };

  /* Comentado para evitar eliminar administradores por ahora
  const eliminar = async (id, nombre) => {
    const result = await Swal.fire({
      title: `¿Eliminar administrador "${nombre}"?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }); 

    if (result.isConfirmed) {
      try {
        await deleteAdministrador(id);
        Swal.fire("Eliminado", "Administrador eliminado correctamente", "success");
        cargarAdministradores();
      } catch {
        Swal.fire("Error", "No se pudo eliminar el administrador", "error");
      }
    }
  }; */

  const abrirModal = (admin = null) => {
    if (admin) {
      setAdminActivo(admin);
      setFormData({ 
        nombre: admin.nombre, 
        email: admin.email, 
        password: "" 
      });
    } else {
      setAdminActivo(null);
      setFormData({ nombre: "", email: "", password: "" });
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setAdminActivo(null);
    setFormData({ nombre: "", email: "", password: "" });
  };

  useEffect(() => {
    cargarAdministradores();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Administradores del Sistema</h3>
        <button 
          className="btn btn-primary" 
          onClick={() => abrirModal()}
        >
          <i className="fas fa-plus me-2"></i>Nuevo Administrador
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {administradores.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.nombre}</td>
                <td>{admin.email}</td>
                <td>
                  {admin.fechaCreacion 
                    ? new Date(admin.fechaCreacion).toLocaleDateString() 
                    : "No disponible"
                  }
                </td>
                <td>
                  <button 
                    className="btn btn-warning btn-sm me-2" 
                    onClick={() => abrirModal(admin)}
                  >
                    <i className="fas fa-edit"></i> Editar
                  </button>

                  {/* Mostrar botón de eliminar solo si no es el mismo usuario */}
                  {user && admin.email !== user.email && (
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => eliminar(admin.id, admin.nombre)}
                    >
                      <i className="fas fa-trash"></i> Eliminar
                    </button>
                  )}
                  
                  {/* Mostrar mensaje si es el mismo usuario */}
                  {user && admin.email === user.email && (
                    <span className="text-muted small">No puedes eliminarte</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {administradores.length === 0 && (
        <div className="text-center mt-4">
          <p className="text-muted">No hay administradores registrados</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {adminActivo ? "Editar Administrador" : "Nuevo Administrador"}
                </h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre completo</label>
                  <input 
                    type="text"
                    className="form-control" 
                    placeholder="Ingrese el nombre completo"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    maxLength="50"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input 
                    type="email"
                    className="form-control" 
                    placeholder="admin@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!!adminActivo}
                    maxLength="50"
                    required
                  />
                  {adminActivo && (
                    <small className="text-muted">
                      El correo no se puede modificar después de la creación
                    </small>
                  )}
                </div>
                {!adminActivo && (
                  <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input 
                      type="password"
                      className="form-control" 
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      maxLength="50"
                      minLength="6"
                      required
                    />
                    <small className="text-muted">
                      Se enviará un correo de verificación al administrador
                    </small>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-success" 
                  onClick={guardar}
                >
                  {adminActivo ? "Actualizar" : "Crear Administrador"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
