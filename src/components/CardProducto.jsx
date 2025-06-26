function CardProducto({ nombre, precio }) {
return (
<div className="card">
<div className="card-body">
<h5 className="card-title">{nombre}</h5>
<p className="card-text">Precio: {precio}</p>
<i className="fas fa-apple-alt"></i>
</div>
</div>
);
}
export default CardProducto;
