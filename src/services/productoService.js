import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  getCountFromServer
} from 'firebase/firestore';

export const addProducto = async (producto) => {
  console.log('➕ AGREGAR - Producto recibido:', producto);
  
  const ref = doc(collection(db, "productos"));
  const fechaActual = new Date().toISOString().split('T')[0];
  
  // Determinar estado automáticamente
  let estado = "disponible";
  if (producto.vencimiento) {
    const fechaVencimiento = new Date(producto.vencimiento);
    const hoy = new Date();
    const diffTime = fechaVencimiento - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      estado = "vencido";
    } else if (diffDays <= 3) {
      estado = "por_vencer";
    }
  }
  
  const productoConId = { 
    ...producto, 
    id: ref.id,
    estado,
    fechaCreacion: fechaActual,
    fechaActualizacion: fechaActual
  };
  
  console.log('💾 AGREGAR - Producto a guardar:', productoConId);
  console.log('💾 AGREGAR - empresaId:', productoConId.empresaId);
  
  await setDoc(ref, productoConId);
  console.log('✅ AGREGAR - Producto guardado con ID:', ref.id);
};

export const deleteProducto = async (id) => await deleteDoc(doc(db, "productos", id));

export const updateProducto = async (id, data) => {
  const ref = doc(db, "productos", id);
  const fechaActual = new Date().toISOString().split('T')[0];
  
  // Determinar estado automáticamente si se actualiza la fecha de vencimiento
  let estado = data.estado || "disponible";
  if (data.vencimiento) {
    const fechaVencimiento = new Date(data.vencimiento);
    const hoy = new Date();
    const diffTime = fechaVencimiento - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      estado = "vencido";
    } else if (diffDays <= 3) {
      estado = "por_vencer";
    }
  }
  
  const updateData = {
    ...data,
    estado,
    fechaActualizacion: fechaActual
  };
  
  await updateDoc(ref, updateData);
};

export async function obtenerTotalProductos(empresaId, filtroEstado = "todos") {
    console.log('🔢 TOTAL - Contando productos para empresa:', empresaId);
    
    const productosRef = collection(db, "productos");
    
    // Query simple sin búsqueda para evitar índice compuesto
    let constraints = [where("empresaId", "==", empresaId)];
    
    // Filtro por estado
    if (filtroEstado !== "todos") {
      constraints.push(where("estado", "==", filtroEstado));
    }
    
    const q = query(productosRef, ...constraints);
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;
    
    console.log('🔢 TOTAL - Resultado:', count);
    return count;
}

export const PAGE_SIZE = 5;

export const getProductosByEmpresaPagina = async (
  empresaId, 
  cursor = null, 
  busqueda = "", 
  filtroEstado = "todos",
  ordenamiento = "nombre_asc",
  pageSize = 5
) => {
    console.log('🔍 SERVICIO - Iniciando consulta productos:');
    console.log('   empresaId:', empresaId);
    console.log('   busqueda:', busqueda);
    console.log('   filtroEstado:', filtroEstado);
    console.log('   cursor:', cursor);
    
    let ref = collection(db, "productos");
    
    // Construir constraints básicos
    let constraints = [where("empresaId", "==", empresaId)];
    
    // Filtro por estado
    if (filtroEstado !== "todos") {
      constraints.push(where("estado", "==", filtroEstado));
    }
    
    // Ordenamiento simple (sin combinar con búsqueda para evitar índice compuesto)
    let orderField = "fechaCreacion";
    let orderDirection = "desc";
    
    switch (ordenamiento) {
      case "nombre_desc":
        orderField = "nombre";
        orderDirection = "desc";
        break;
      case "nombre_asc":
        orderField = "nombre";
        orderDirection = "asc";
        break;
      case "precio_asc":
        orderField = "precio";
        orderDirection = "asc";
        break;
      case "precio_desc":
        orderField = "precio";
        orderDirection = "desc";
        break;
      case "fecha_asc":
        orderField = "fechaCreacion";
        orderDirection = "asc";
        break;
      case "fecha_desc":
        orderField = "fechaCreacion";
        orderDirection = "desc";
        break;
      default:
        orderField = "fechaCreacion";
        orderDirection = "desc";
    }
    
    constraints.push(orderBy(orderField, orderDirection));
    
    // Aplicar cursor si existe (paginación)
    if (cursor) {
        constraints.push(startAfter(cursor));
    }
    
    // Aplicar límite (obtener más si hay búsqueda para filtrar en cliente)
    const fetchSize = busqueda.trim() !== "" ? pageSize * 3 : pageSize;
    constraints.push(limit(fetchSize));
    
    // Crear query final
    let q = query(ref, ...constraints);
    
    console.log('🔍 SERVICIO - Ejecutando query...');
    const snapshot = await getDocs(q);
    let productos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Filtrar por búsqueda en el cliente si es necesario
    if (busqueda.trim() !== "") {
        const term = busqueda.toLowerCase();
        productos = productos.filter(producto => 
            producto.nombre && producto.nombre.toLowerCase().includes(term)
        );
        // Limitar al tamaño de página después del filtro
        productos = productos.slice(0, pageSize);
    }
    
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    
    console.log('📦 SERVICIO - Resultados:');
    console.log('   snapshot.size:', snapshot.size);
    console.log('   productos después de filtro:', productos);

    return { productos, lastVisible };
};
