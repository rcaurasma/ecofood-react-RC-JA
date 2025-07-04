import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getEmpresas,
  updateEmpresa,
  deleteEmpresa,
  registrarEmpresaConAuth
} from "../../services/empresaFirebase";

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [empresaActiva, setEmpresaActiva] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    rut: "",
    direccion: "",
    comuna: "",
    email: "",
    telefono: "",
    password: ""
  });

  const cargarEmpresas = async () => {
    try {
      const data = await getEmpresas();
      setEmpresas(data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar las empresas", "error");
    }
  };

  const validarRut = (rut) => {
    // Validación básica de formato RUT chileno
    const rutRegex = /^[0-9]+-[0-9kK]{1}$/;
    return rutRegex.test(rut);
  };

  const validarFormulario = () => {
    if (!formData.nombre || formData.nombre.length < 2) {
      Swal.fire("Error", "El nombre debe tener al menos 2 caracteres", "warning");
      return false;
    }
    if (!formData.rut || !validarRut(formData.rut)) {
      Swal.fire("Error", "Ingrese un RUT válido (formato: 12345678-9)", "warning");
      return false;
    }
    if (!formData.direccion || formData.direccion.length < 5) {
      Swal.fire("Error", "La dirección debe tener al menos 5 caracteres", "warning");
      return false;
    }
    if (!formData.comuna || formData.comuna.length < 2) {
      Swal.fire("Error", "La comuna debe tener al menos 2 caracteres", "warning");
      return false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      Swal.fire("Error", "Ingrese un correo electrónico válido", "warning");
      return false;
    }
    if (formData.telefono && formData.telefono.length < 8) {
      Swal.fire("Error", "El teléfono debe tener al menos 8 caracteres", "warning");
      return false;
    }
    if (!empresaActiva && (!formData.password || formData.password.length < 6)) {
      Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres", "warning");
      return false;
    }
    return true;
  };

  const guardar = async () => {
    if (!validarFormulario()) return;

    try {
      if (empresaActiva) {
        // Editar empresa existente (sin cambiar contraseña)
        // eslint-disable-next-line no-unused-vars
        const { password, ...dataWithoutPassword } = formData;
        await updateEmpresa(empresaActiva.id, dataWithoutPassword);
        Swal.fire("Éxito", "Empresa actualizada correctamente", "success");
      } else {
        // Crear nueva empresa con autenticación
        await registrarEmpresaConAuth(formData);
        Swal.fire("Éxito", "Empresa creada. Se envió un correo de verificación.", "success");
      }
      
      setShowModal(false);
      setFormData({
        nombre: "",
        rut: "",
        direccion: "",
        comuna: "",
        email: "",
        telefono: "",
        password: ""
      });
      setEmpresaActiva(null);
      cargarEmpresas();
    } catch (error) {
      console.error("Error al guardar:", error);
      if (error.code === 'already-exists') {
        Swal.fire("Error", "Ya existe una empresa con este RUT", "error");
      } else if (error.code === 'auth/email-already-in-use') {
        Swal.fire("Error", "Este correo electrónico ya está registrado", "error");
      } else {
        Swal.fire("Error", "No se pudo guardar la empresa", "error");
      }
    }
  };

  const eliminar = async (id, nombre) => {
    const result = await Swal.fire({
      title: `¿Eliminar empresa "${nombre}"?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await deleteEmpresa(id);
        Swal.fire("Eliminado", "Empresa eliminada correctamente", "success");
        cargarEmpresas();
      } catch {
        Swal.fire("Error", "No se pudo eliminar la empresa", "error");
      }
    }
  };

  const abrirModal = (empresa = null) => {
    if (empresa) {
      setEmpresaActiva(empresa);
      setFormData({
        nombre: empresa.nombre || "",
        rut: empresa.rut || "",
        direccion: empresa.direccion || "",
        comuna: empresa.comuna || "",
        email: empresa.email || "",
        telefono: empresa.telefono || "",
        password: ""
      });
    } else {
      setEmpresaActiva(null);
      setFormData({
        nombre: "",
        rut: "",
        direccion: "",
        comuna: "",
        email: "",
        telefono: "",
        password: ""
      });
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEmpresaActiva(null);
    setFormData({
      nombre: "",
      rut: "",
      direccion: "",
      comuna: "",
      email: "",
      telefono: "",
      password: ""
    });
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Gestión de Empresas</h3>
        <button 
          className="btn btn-primary" 
          onClick={() => abrirModal()}
        >
          <i className="fas fa-plus me-2"></i>Nueva Empresa
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>RUT</th>
              <th>Email</th>
              <th>Comuna</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((empresa) => (
              <tr key={empresa.id}>
                <td>{empresa.nombre}</td>
                <td>{empresa.rut}</td>
                <td>{empresa.email}</td>
                <td>{empresa.comuna}</td>
                <td>{empresa.telefono || "No especificado"}</td>
                <td>
                  <button 
                    className="btn btn-warning btn-sm me-2" 
                    onClick={() => abrirModal(empresa)}
                  >
                    <i className="fas fa-edit"></i> Editar
                  </button>
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => eliminar(empresa.id, empresa.nombre)}
                  >
                    <i className="fas fa-trash"></i> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {empresas.length === 0 && (
        <div className="text-center mt-4">
          <p className="text-muted">No hay empresas registradas</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {empresaActiva ? "Editar Empresa" : "Nueva Empresa"}
                </h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre de la empresa</label>
                  <input 
                    type="text"
                    className="form-control" 
                    placeholder="Ingrese el nombre de la empresa"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    maxLength="50"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">RUT</label>
                  <input 
                    type="text"
                    className="form-control" 
                    placeholder="12345678-9"
                    value={formData.rut}
                    onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
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
                    required
                  />
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
                  <label className="form-label">Correo electrónico</label>
                  <input 
                    type="email"
                    className="form-control" 
                    placeholder="empresa@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!!empresaActiva}
                    maxLength="50"
                    required
                  />
                  {empresaActiva && (
                    <small className="text-muted">
                      El correo no se puede modificar después de la creación
                    </small>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono (opcional)</label>
                  <input 
                    type="tel"
                    className="form-control" 
                    placeholder="Ej: +56 2 1234 5678"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    maxLength="50"
                  />
                </div>
                {!empresaActiva && (
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
                      Se enviará un correo de verificación a la empresa
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
                  {empresaActiva ? "Actualizar" : "Crear Empresa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
