import { useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { deleteProducto } from "../../services/productoService";
import TablaProductos from '../../components/empresa/TablaProductos'
import ModalProductos from '../../components/empresa/ModalProductos'
export default function Productos() {
const { userData } = useAuth();
const [busqueda, setBusqueda] = useState("");
const [refreshTick, setRefreshTick] = useState(0); // para refetch después de borrar
const [showModal, setShowModal] = useState(false);
const [formData, setFormData] = useState({ nombre: "", descripcion: "", precio: 0,
vencimiento: "", id: null });
const handleRefresh = () => {
setRefreshTick((t) => t + 1)
};
const eliminar = useCallback(async (id) => {
try {
const confirm = await Swal.fire({ title: "¿Eliminar producto?", showCancelButton: true
});
if (confirm.isConfirmed) {
await deleteProducto(id);
handleRefresh()
} else { return;}
} catch (e) {
console.error(e);
alert('Error al eliminar'); // manejo simple; mejora a tu gusto
}
}, []);
const abrirModal = (producto = null) => {
if (producto) {
setFormData({ ...producto });
} else {
setFormData({ nombre: "", descripcion: "", precio: 0, vencimiento: "", id: null });
}
setShowModal(true);
};
return (<>
<div className="container mt-4">
<div className="row g-4">
<div className="col-12">
<h3>Gestión de Productos</h3>
</div>
<div className="col"></div>
<div className="col-auto">
<button className="btn btn-primary" onClick={() => abrirModal()} >Agregar
Producto</button>
</div>
<div className="col-12">
<div className="btn-group" role="group" aria-label="Basic example"
style={{width:'100%'}}>
<input className="form-control" type="search" placeholder="Buscar nombre"
value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
<button className="btn btn-outline-success" onClick={() => handleRefresh()
} ><i className="fa-solid fa-arrows-rotate"></i></button>
</div>
</div>
<div className="col-12">
<TablaProductos
key={refreshTick}
busqueda={busqueda}
userData={userData}
eliminar={(id) => eliminar(id) }
abrirModal={(p) => abrirModal(p) }
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
abrirModal={(p)=> abrirModal(p) }
handleRefresh={ handleRefresh }
/>
</>);
}