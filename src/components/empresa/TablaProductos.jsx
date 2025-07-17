import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { obtenerTotalProductos, getProductosByEmpresaPagina, PAGE_SIZE } from
'../../services/productoService';

TablaProductos.propTypes = {
    userData: PropTypes.object,
    busqueda: PropTypes.string,
    eliminar: PropTypes.func.isRequired,
    abrirModal: PropTypes.func.isRequired,
};

export default function TablaProductos({ userData, busqueda, eliminar, abrirModal }) {
    const [total, setTotal] = useState(0);
    const [historial, setHistorial] = useState([null]); // Inicializar con null para página 0
    const [pagina, setPagina] = useState(0);
    const [productos, setProductos] = useState([]);
    const [sinMas, setSinMas] = useState(false);

    // Reset pagination when search changes
    useEffect(() => {
        setPagina(0);
        setHistorial([null]);
    }, [busqueda]);

    useEffect(() => {
        if (!userData) return;
        
        const fetchTotal = async () => {
            const cantidad = await obtenerTotalProductos(userData.uid);
            setTotal(cantidad);
        };
        
        fetchTotal();
    }, [userData, busqueda]);

    useEffect(() => {
        const cargarPagina = async () => {
            if (!userData) return;
            
            try {
                console.log('🔍 DEBUG - Cargando productos para empresa:', userData.uid);
                console.log('🔍 DEBUG - Búsqueda:', busqueda);
                console.log('🔍 DEBUG - Página:', pagina);
                
                // Obtener el cursor de la página actual
                const cursor = historial[pagina];
                
                const { productos: nuevos, lastVisible } = await 
                    getProductosByEmpresaPagina(userData.uid, cursor, busqueda);
                
                console.log('📦 DEBUG - Productos obtenidos:', nuevos);
                console.log('📦 DEBUG - Cantidad de productos:', nuevos.length);
                
                setProductos(nuevos);
                
                // Actualizar historial solo si avanzamos a una nueva página
                if (pagina === historial.length - 1 && lastVisible) {
                    setHistorial(prev => [...prev, lastVisible]);
                }
                
                setSinMas(nuevos.length < PAGE_SIZE);
            } catch (error) {
                console.error('❌ Error cargando productos:', error);
                setProductos([]);
            }
        };

        cargarPagina();
    }, [pagina, userData, busqueda, historial]);

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

    return (
        <div className="row">
            <div className="col-12">
                <ul className="list-group mb-3">
                    {productos.map((p, i) => (
                        <li key={p.id || i} className="list-group-item d-flex justify-content-between align-items-center">
                            {p.nombre} - ${p.precio}
                            <div>
                                <button 
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => abrirModal(p)}
                                >
                                    Editar
                                </button>
                                <button 
                                    className="btn btn-danger btn-sm" 
                                    onClick={() => eliminar(p.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                
                {productos.length === 0 && (
                    <div className="text-center text-muted py-3">
                        No se encontraron productos
                    </div>
                )}
            </div>
            
            <div className="col">
                <p>Total de productos: {total}</p>
                <p className="text-muted small">Página {pagina + 1}</p>
            </div>
            
            <div className="col-auto">
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${pagina === 0 ? "disabled" : ""}`}>
                            <button 
                                className="page-link" 
                                onClick={irPaginaAnterior}
                                disabled={pagina === 0}
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                        </li>
                        <li className={`page-item ${sinMas ? "disabled" : ""}`}>
                            <button 
                                className="page-link" 
                                onClick={irPaginaSiguiente}
                                disabled={sinMas}
                            >
                                <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}