// src/pages/empresa/Productos.jsx
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { deleteProducto } from "../../services/productoService";
import TablaProductos from "./TablaProductos";
import ModalProductos from "./ModalProductos";

export default function Productos() {
  const navigate = useNavigate();
  const { userData, loading } = useAuth();

  const [busqueda, setBusqueda] = useState("");
  // Estado para el filtro de estado del producto
  // Puede ser: "todos", "disponible", "agotado", "inactivo", "porVencer", "vencidos"
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  // Estados para el ordenamiento
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // Opciones: "nombre", "precio", "vencimiento"
  const [ordenDireccion, setOrdenDireccion] = useState("asc"); // Opciones: "asc", "desc"
  // Estado para la cantidad de productos por página
  const [productosPorPagina, setProductosPorPagina] = useState(5); // Opciones: 5, 10, 20
  // Un "tick" para forzar la actualización de TablaProductos cuando sea necesario
  const [refreshTick, setRefreshTick] = useState(0);

  // Estados para el modal de agregar/editar producto
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    vencimiento: "",
    cantidad: 0,
    precio: 0,
    estado: "disponible", // Estado por defecto para nuevos productos
    id: null // Para identificar si es un producto existente (edición)
  });

  // Callback para forzar la recarga de la tabla
  const handleRefresh = useCallback(() => {
    setRefreshTick((t) => t + 1);
  }, []);

  // Callback para eliminar un producto
  const eliminar = useCallback(async (id) => {
    try {
      const confirmResult = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo",
        cancelButtonText: "Cancelar"
      });
      if (confirmResult.isConfirmed) {
        await deleteProducto(id);
        Swal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success");
        handleRefresh(); // Refrescar la tabla después de eliminar
      }
    } catch (e) {
      console.error("Error al eliminar producto:", e);
      Swal.fire("Error", "No se pudo eliminar el producto.", "error");
    }
  }, [handleRefresh]);

  // Callback para abrir el modal, prellenando si es para edición
  const abrirModal = useCallback((producto = null) => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        vencimiento: producto.vencimiento || "",
        cantidad: producto.cantidad || 0,
        precio: producto.precio || 0,
        estado: producto.estado || "disponible",
        id: producto.id || null
      });
    } else {
      // Resetear el formulario para un nuevo producto
      setFormData({
        nombre: "",
        descripcion: "",
        vencimiento: "",
        cantidad: 0,
        precio: 0,
        estado: "disponible",
        id: null
      });
    }
    setShowModal(true); // Mostrar el modal
  }, []);

  // Lógica de carga y verificación del rol de usuario
  if (loading) {
    return <p className="text-center mt-5">Cargando información de la sesión...</p>;
  }


  if (userData.tipo !== "empresa") {
    return (
      <div className="alert alert-warning text-center mt-5">
        Acceso denegado. Solo las empresas pueden ver esta sección.
      </div>
    );
  }

  return (
    <>
      <div className="container mt-4">
        <div className="row g-4">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <h3>Gestión de Productos</h3>
            <button className="btn btn-secondary" onClick={() => navigate("/empresa/dashboard")}>
              Volver al Dashboard
            </button>
          </div>

          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary" onClick={() => abrirModal()}>
              Agregar Producto
            </button>
          </div>

          <div className="col-12">
            <div className="input-group mb-3">
              <input
                className="form-control"
                type="search"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <select
                className="form-select"
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="disponible">Disponible</option>
                <option value="agotado">Agotado</option>
                <option value="inactivo">Inactivo</option>
                {/* CORRECCIÓN: "Por Vencer (<= 3 días)" se cambió a "Por Vencer (3 días o menos)" */}
                <option value="porVencer">Por Vencer (3 días o menos)</option>
                <option value="vencidos">Vencidos</option>
              </select>
              <button className="btn btn-outline-success" onClick={handleRefresh} title="Actualizar lista">
                <i className="fa-solid fa-arrows-rotate"></i> Actualizar
              </button>
            </div>
            {/* Controles de Ordenamiento y Productos por Página */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <label htmlFor="ordenCampo" className="form-label me-2 mb-0">Ordenar por:</label>
                <select
                  id="ordenCampo"
                  className="form-select w-auto me-2"
                  value={ordenCampo}
                  onChange={(e) => setOrdenCampo(e.target.value)}
                >
                  <option value="nombre">Nombre</option>
                  <option value="precio">Precio</option>
                  <option value="vencimiento">Vencimiento</option>
                </select>
                <select
                  id="ordenDireccion"
                  className="form-select w-auto"
                  value={ordenDireccion}
                  onChange={(e) => setOrdenDireccion(e.target.value)}
                >
                  <option value="asc">Ascendente</option>
                  <option value="desc">Descendente</option>
                </select>
              </div>
              <div className="d-flex align-items-center">
                <label htmlFor="productosPorPagina" className="form-label me-2 mb-0">Productos por página:</label>
                <select
                  id="productosPorPagina"
                  className="form-select w-auto"
                  value={productosPorPagina}
                  onChange={(e) => setProductosPorPagina(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>
          </div>

          <div className="col-12">
            <TablaProductos
              // La 'key' se cambia para forzar que el componente TablaProductos se remonte
              // y reinicie su estado interno de paginación/carga cuando cambian los filtros
              key={`${refreshTick}-${productosPorPagina}-${ordenCampo}-${ordenDireccion}-${busqueda}-${estadoFiltro}`}
              busqueda={busqueda}
              estadoFiltro={estadoFiltro}
              ordenCampo={ordenCampo}
              ordenDireccion={ordenDireccion}
              productosPorPagina={productosPorPagina}
              userData={userData}
              eliminar={eliminar}
              abrirModal={abrirModal}
              refreshTick={refreshTick}
            />
          </div>
        </div>
      </div>

      <ModalProductos
        id={'productoModal'}
        show={showModal}
        setShow={setShowModal}
        userData={userData}
        formData={formData}
        setFormData={setFormData}
        handleRefresh={handleRefresh}
      />
    </>
  );
}