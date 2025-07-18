import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { deleteProducto, getProductosByEmpresaPagina, obtenerTotalProductos } from "../../services/productoService";
import ProductoCard from "../../components/ProductoCard";
import ProductoModal from "../../components/ProductoModal";
export default function ProductosEmpresa() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  
  // Estados para productos y paginación
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(0);
  const [historial, setHistorial] = useState([null]);
  const [sinMas, setSinMas] = useState(false);
  
  // Estados para filtros y controles
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [ordenamiento, setOrdenamiento] = useState("nombre_asc");
  const [productosPorPagina, setProductosPorPagina] = useState(5);
  const [refreshTick, setRefreshTick] = useState(0);
  
  // Estados para modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    vencimiento: "",
    cantidad: 1,
    id: null
  });

  // Reset pagination when filters change
  useEffect(() => {
    setPagina(0);
    setHistorial([null]);
  }, [busqueda, filtroEstado, ordenamiento, productosPorPagina]);

  // Cargar total de productos
  useEffect(() => {
    const cargarTotal = async () => {
      if (!userData?.uid) return;
      
      try {
        const cantidad = await obtenerTotalProductos(userData.uid, busqueda, filtroEstado);
        setTotal(cantidad);
      } catch (error) {
        console.error('Error al cargar total:', error);
      }
    };
    
    cargarTotal();
  }, [userData, busqueda, filtroEstado, refreshTick]);

  // Cargar productos
  useEffect(() => {
    const cargarProductos = async () => {
      if (!userData?.uid) return;
      
      try {
        setLoading(true);
        const cursor = historial[pagina];
        
        const { productos: nuevos, lastVisible } = await getProductosByEmpresaPagina(
          userData.uid,
          cursor,
          busqueda,
          filtroEstado,
          ordenamiento,
          productosPorPagina
        );
        
        setProductos(nuevos);
        
        // Actualizar historial solo si avanzamos a una nueva página
        if (pagina === historial.length - 1 && lastVisible) {
          setHistorial(prev => [...prev, lastVisible]);
        }
        
        setSinMas(nuevos.length < productosPorPagina);
      } catch (error) {
        console.error('Error cargando productos:', error);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, [pagina, userData, busqueda, filtroEstado, ordenamiento, productosPorPagina, historial, refreshTick]);

  const handleRefresh = useCallback(() => {
    setRefreshTick(t => t + 1);
    setPagina(0);
    setHistorial([null]);
  }, []);

  const eliminarProducto = useCallback(async (id) => {
    try {
      const resultado = await Swal.fire({
        title: '¿Eliminar producto?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });
      
      if (resultado.isConfirmed) {
        await deleteProducto(id);
        await Swal.fire({
          title: '¡Eliminado!',
          text: 'El producto ha sido eliminado correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        handleRefresh();
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      await Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al eliminar el producto',
        icon: 'error'
      });
    }
  }, [handleRefresh]);

  const abrirModal = useCallback((producto = null) => {
    if (producto) {
      setFormData({ ...producto });
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        precio: 0,
        vencimiento: "",
        cantidad: 1,
        id: null
      });
    }
    setShowModal(true);
  }, []);

  const irPaginaAnterior = () => {
    if (pagina > 0) {
      setPagina(pagina - 1);
    }
  };

  const irPaginaSiguiente = () => {
    if (!sinMas) {
      setPagina(pagina + 1);
    }
  };

  // Opciones para filtros
  const opcionesEstado = [
    { value: "todos", label: "Todos los productos", icon: "fas fa-list" },
    { value: "disponible", label: "Disponibles", icon: "fas fa-check-circle text-success" },
    { value: "por_vencer", label: "Por vencer", icon: "fas fa-exclamation-triangle text-warning" },
    { value: "vencido", label: "Vencidos", icon: "fas fa-times-circle text-danger" }
  ];

  const opcionesOrdenamiento = [
    { value: "nombre_asc", label: "Nombre (A-Z)" },
    { value: "nombre_desc", label: "Nombre (Z-A)" },
    { value: "precio_asc", label: "Precio (menor a mayor)" },
    { value: "precio_desc", label: "Precio (mayor a menor)" },
    { value: "fecha_desc", label: "Más recientes" },
    { value: "fecha_asc", label: "Más antiguos" }
  ];

  const opcionesProductosPorPagina = [5, 10, 20];

  return (
    <>
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            {/* Botón de regreso */}
            <div className="mb-3">
              <button 
                className="btn btn-outline-secondary"
                onClick={() => navigate("/empresa/dashboard")}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Volver al Dashboard
              </button>
            </div>
            
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>
                <i className="fas fa-box me-2"></i>
                Gestión de Productos
              </h3>
              <button 
                className="btn btn-primary"
                onClick={() => abrirModal()}
              >
                <i className="fas fa-plus me-1"></i>
                Agregar Producto
              </button>
            </div>

            {/* Controles de filtrado y búsqueda */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row g-3">
                  {/* Búsqueda */}
                  <div className="col-lg-4">
                    <label className="form-label">Buscar producto</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                      <input
                        className="form-control"
                        type="search"
                        placeholder="Buscar por nombre..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Filtro por estado */}
                  <div className="col-lg-3">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-select"
                      value={filtroEstado}
                      onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                      {opcionesEstado.map(opcion => (
                        <option key={opcion.value} value={opcion.value}>
                          {opcion.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ordenamiento */}
                  <div className="col-lg-3">
                    <label className="form-label">Ordenar por</label>
                    <select
                      className="form-select"
                      value={ordenamiento}
                      onChange={(e) => setOrdenamiento(e.target.value)}
                    >
                      {opcionesOrdenamiento.map(opcion => (
                        <option key={opcion.value} value={opcion.value}>
                          {opcion.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Productos por página */}
                  <div className="col-lg-2">
                    <label className="form-label">Por página</label>
                    <select
                      className="form-select"
                      value={productosPorPagina}
                      onChange={(e) => setProductosPorPagina(parseInt(e.target.value))}
                    >
                      {opcionesProductosPorPagina.map(cantidad => (
                        <option key={cantidad} value={cantidad}>
                          {cantidad}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col">
                    <button
                      className="btn btn-outline-success"
                      onClick={handleRefresh}
                      disabled={loading}
                    >
                      <i className="fas fa-sync-alt me-1"></i>
                      Actualizar
                    </button>
                  </div>
                  <div className="col-auto">
                    <span className="text-muted">
                      Total: {total} productos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de productos */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="text-muted">Cargando productos...</p>
              </div>
            ) : productos.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="fas fa-box-open fa-3x text-muted"></i>
                </div>
                <h5 className="text-muted">No hay productos que mostrar</h5>
                <p className="text-muted">
                  {busqueda || filtroEstado !== "todos" 
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "¡Comienza agregando tu primer producto!"
                  }
                </p>
                {!busqueda && filtroEstado === "todos" && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => abrirModal()}
                  >
                    <i className="fas fa-plus me-1"></i>
                    Agregar Primer Producto
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="row g-3 mb-4">
                  {productos.map((producto) => (
                    <div key={producto.id} className="col-md-6 col-lg-4">
                      <ProductoCard
                        producto={producto}
                        onEditar={abrirModal}
                        onEliminar={eliminarProducto}
                      />
                    </div>
                  ))}
                </div>

                {/* Paginación */}
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-0">
                      Página {pagina + 1} - Mostrando {productos.length} de {total} productos
                    </p>
                  </div>
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${pagina === 0 ? "disabled" : ""}`}>
                        <button 
                          className="page-link" 
                          onClick={irPaginaAnterior}
                          disabled={pagina === 0}
                        >
                          <i className="fas fa-chevron-left"></i>
                          <span className="d-none d-sm-inline ms-1">Anterior</span>
                        </button>
                      </li>
                      <li className="page-item active">
                        <span className="page-link">
                          {pagina + 1}
                        </span>
                      </li>
                      <li className={`page-item ${sinMas ? "disabled" : ""}`}>
                        <button 
                          className="page-link" 
                          onClick={irPaginaSiguiente}
                          disabled={sinMas}
                        >
                          <span className="d-none d-sm-inline me-1">Siguiente</span>
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal para agregar/editar productos */}
      <ProductoModal
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
