import { addProducto, updateProducto } from '../../services/productoService';
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
export default function AddProductos({ show, setShow, userData, handleRefresh, formData,
setFormData}) {
const guardarProducto = async (e) => {
e.preventDefault();
if (formData.id) {
await updateProducto(formData.id, formData);
Swal.fire("Actualizado correctamente", "", "success");
} else {
await addProducto({ ...formData, empresaId: userData.uid });
Swal.fire("Agregado correctamente", "", "success");
}
handleRefresh();
setShow(false)
};
return (
<Modal
show={show}
onHide={() => setShow(false)}
centered
backdrop="static"
keyboard={false}
>
<Modal.Header >
<Modal.Title>{formData.id ? "Editar" : "Agregar"} Producto</Modal.Title>
</Modal.Header>
<form onSubmit={guardarProducto}>
<Modal.Body closeButton>
<input className="form-control mb-2" placeholder="Nombre"
value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
<textarea className="form-control mb-2" placeholder="Descripción"
value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion:
e.target.value })}></textarea>
<input type="number" className="form-control mb-2" placeholder="Precio"
value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: e.target.value })} />
<input type="date" className="form-control" value={formData.vencimiento}
onChange={(e) => setFormData({ ...formData, vencimiento: e.target.value })} />
</Modal.Body>
<Modal.Footer>
<button type="button" className="btn btn-secondary" onClick={() =>
setShow(false)}>Cerrar</button>
<button type="submit" className="btn btn-success">Guardar</button>
</Modal.Footer>
</form>
</Modal>
);
}