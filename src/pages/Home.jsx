import { useEffect, useState } from "react";
import { getUserData } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import CerrarSesion from "../components/CerrarSesion";
import { useNavigate } from "react-router-dom";

function Home() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const navigate = useNavigate();

  // Productos disponibles
  const productos = [
    { id: 1, nombre: "Pan Integral", precio: 500, categoria: "panaderia", empresa: "Panadería Verde" },
    { id: 2, nombre: "Huevos Orgánicos", precio: 300, categoria: "lacteos", empresa: "Granja Ecológica" },
    { id: 3, nombre: "Ensalada de Frutas", precio: 1200, categoria: "frutas", empresa: "Frutas Frescas" },
    { id: 4, nombre: "Ensalada de Verduras", precio: 1000, categoria: "verduras", empresa: "Huerta Orgánica" },
    { id: 5, nombre: "Pescado Fresco", precio: 2500, categoria: "carnes", empresa: "Pescadería del Mar" },
    { id: 6, nombre: "Leche Orgánica", precio: 800, categoria: "lacteos", empresa: "Lácteos Naturales" },
    { id: 7, nombre: "Queso Fresco", precio: 1500, categoria: "lacteos", empresa: "Quesería Artesanal" },
    { id: 8, nombre: "Yogur Natural", precio: 900, categoria: "lacteos", empresa: "Lácteos Naturales" },
    { id: 9, nombre: "Avena Integral", precio: 600, categoria: "cereales", empresa: "Cereales Integrales" }
  ];

  useEffect(() => {
    const fetch = async () => {
      try {
        const datos = await getUserData(user.uid);
        setUserData(datos);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    if (user) fetch();
  }, [user]);

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || producto.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div 
      className="container-fluid mt-4" 
      style={{ 
        minHeight: '100vh',
        backgroundImage: 'url(/FondoVerde.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="text-success mb-1">
                    <i className="fas fa-leaf me-2"></i>
                    EcoFood - Rescate Alimentario
                  </h2>
                  <p className="text-muted mb-0">Productos frescos de empresas locales</p>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => navigate("/cliente/dashboard")}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Volver
                  </button>
                  <CerrarSesion />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saludo al usuario */}
      {userData && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-success" style={{ backgroundColor: 'rgba(212, 237, 218, 0.9)' }}>
              <h5>¡Hola {userData.nombre}!</h5>
              <p className="mb-0">Encuentra productos frescos y ayuda a reducir el desperdicio alimentario</p>
            </div>
          </div>
        </div>
      )}

      {/* Filtros simples */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <div className="card-body">
              <label className="form-label">Buscar productos:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Escribe el nombre del producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <div className="card-body">
              <label className="form-label">Filtrar por categoría:</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="todos">Todas las categorías</option>
                <option value="frutas">Frutas</option>
                <option value="verduras">Verduras</option>
                <option value="lacteos">Lácteos</option>
                <option value="panaderia">Panadería</option>
                <option value="carnes">Carnes y Pescados</option>
                <option value="cereales">Cereales</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <div className="card-body">
              <h3 className="mb-3">
                <i className="fas fa-store me-2"></i>
                Productos Disponibles ({productosFiltrados.length})
              </h3>
              
              {productosFiltrados.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-search text-muted" style={{fontSize: '3rem'}}></i>
                  <h4 className="text-muted mt-3">No se encontraron productos</h4>
                  <p className="text-muted">Intenta cambiar los filtros de búsqueda</p>
                </div>
              ) : (
                <div className="row g-3">
                  {productosFiltrados.map(producto => (
                    <div key={producto.id} className="col-lg-4 col-md-6">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title text-success">{producto.nombre}</h5>
                          <p className="text-muted small">
                            <i className="fas fa-building me-1"></i>
                            {producto.empresa}
                          </p>
                          <h4 className="text-success">${producto.precio}</h4>
                          <button className="btn btn-success w-100 mt-2">
                            <i className="fas fa-cart-plus me-2"></i>
                            Agregar al carrito
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer simple */}
      <div className="row mt-4 mb-4">
        <div className="col-12">
          <div className="alert alert-success" style={{ backgroundColor: 'rgba(212, 237, 218, 0.9)' }}>
            <div className="text-center">
              <h5>
                <i className="fas fa-recycle me-2"></i>
                ¡Gracias por ayudar al medio ambiente!
              </h5>
              <p className="mb-0">
                Cada compra contribuye a reducir el desperdicio de alimentos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;






