import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
getClientes,
updateCliente,
deleteCliente,
registrarClienteConAuth
} from "../../services/clienteFirebase";
export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);
  const [clienteActivo, setClienteActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    nombre: "", 
    email: "", 
    comuna: "", 
    direccion: "", 
    telefono: "", 
    password: "" 
  });

  const cargarClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los clientes", "error");
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
    if (!formData.comuna || formData.comuna.length < 2) {
      Swal.fire("Error", "La comuna debe tener al menos 2 caracteres", "warning");
      return false;
    }
    if (!clienteActivo && (!formData.password || formData.password.length < 6)) {
      Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres", "warning");
      return false;
    }
    return true;
  };

  const guardar = async () => {
    if (!validarFormulario()) return;

    try {
      if (clienteActivo) {
        // Editar cliente existente (sin cambiar contraseña)
        // eslint-disable-next-line no-unused-vars
        const { password, ...dataWithoutPassword } = formData;
        await updateCliente(clienteActivo.id, dataWithoutPassword);
        Swal.fire("Éxito", "Cliente actualizado correctamente", "success");
      } else {
        // Crear nuevo cliente
        await registrarClienteConAuth(formData);
        Swal.fire("Éxito", "Cliente creado. Se envió un correo de verificación.", "success");
      }
      
      setShowModal(false);
      setFormData({ nombre: "", email: "", comuna: "", direccion: "", telefono: "", password: "" });
      setClienteActivo(null);
      cargarClientes();
    } catch (error) {
      console.error("Error al guardar:", error);
      if (error.code === 'auth/email-already-in-use') {
        Swal.fire("Error", "Este correo electrónico ya está registrado", "error");
      } else {
        Swal.fire("Error", "No se pudo guardar el cliente", "error");
      }
    }
  };
  const eliminar = async (id, nombre) => {
    const result = await Swal.fire({
      title: `¿Eliminar cliente "${nombre}"?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await deleteCliente(id);
        Swal.fire("Eliminado", "Cliente eliminado correctamente", "success");
        cargarClientes();
      } catch {
        Swal.fire("Error", "No se pudo eliminar el cliente", "error");
      }
    }
  };

  const abrirModal = (cliente = null) => {
    if (cliente) {
      setClienteActivo(cliente);
      setFormData({ 
        nombre: cliente.nombre || "", 
        email: cliente.email || "", 
        comuna: cliente.comuna || "",
        direccion: cliente.direccion || "",
        telefono: cliente.telefono || "",
        password: "" 
      });
    } else {
      setClienteActivo(null);
      setFormData({ nombre: "", email: "", comuna: "", direccion: "", telefono: "", password: "" });
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setClienteActivo(null);
    setFormData({ nombre: "", email: "", comuna: "", direccion: "", telefono: "", password: "" });
  };
useEffect(() => {
cargarClientes();
}, []);
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Clientes Registrados</h3>
        <button 
          className="btn btn-primary" 
          onClick={() => abrirModal()}
        >
          <i className="fas fa-plus me-2"></i>Nuevo Cliente
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Comuna</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.email}</td>
                <td>{c.comuna}</td>
                <td>{c.telefono || "No especificado"}</td>
                <td>
                  <button 
                    className="btn btn-warning btn-sm me-2" 
                    onClick={() => abrirModal(c)}
                  >
                    <i className="fas fa-edit"></i> Editar
                  </button>
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => eliminar(c.id, c.nombre)}
                  >
                    <i className="fas fa-trash"></i> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {clientes.length === 0 && (
        <div className="text-center mt-4">
          <p className="text-muted">No hay clientes registrados</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {clienteActivo ? "Editar Cliente" : "Nuevo Cliente"}
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
                    placeholder="cliente@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!!clienteActivo}
                    maxLength="50"
                    required
                  />
                  {clienteActivo && (
                    <small className="text-muted">
                      El correo no se puede modificar después de la creación
                    </small>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Comuna</label>
                  <input 
                    type="text"
                    className="form-control" 
                    placeholder="Ingrese la comuna"
                    value={formData.comuna}
                    onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                    maxLength="50"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Dirección</label>
                  <input 
                    type="text"
                    className="form-control" 
                    placeholder="Ingrese la dirección completa"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    maxLength="50"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono (opcional)</label>
                  <input 
                    type="tel"
                    className="form-control" 
                    placeholder="Ej: +56 9 1234 5678"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    maxLength="50"
                  />
                </div>
                {!clienteActivo && (
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
                      Se enviará un correo de verificación al cliente
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
                  {clienteActivo ? "Actualizar" : "Crear Cliente"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}