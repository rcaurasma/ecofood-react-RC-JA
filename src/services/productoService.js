import { db } from "./firebase";
import {
  collection,
  setDoc,
  getDocs,
  updateDoc,
  query,
  where,
  deleteDoc,
  doc,
  orderBy,
  limit,
  startAt,
  endAt,
  startAfter,
  getCountFromServer, // SDK v9+ → consulta agregada COUNT
} from "firebase/firestore";
export const addProducto = async (producto) => {
  const ref = doc(collection(db, "productos")); // genera ID
  const productoConId = { ...producto, id: ref.id };
  await setDoc(ref, productoConId);
};
export const deleteProducto = async (id) => await deleteDoc(doc(db, "productos", id));
export const updateProducto = async (id, data) => {
  const ref = doc(db, "productos", id);
  await updateDoc(ref, data);
};
export async function obtenerTotalProductos(empresaId, busqueda = "") {
    const productosRef = collection(db, "productos");
    
    // Query base
    let q = query(productosRef, where("empresaId", "==", empresaId));
    
    // Solo aplicar búsqueda si hay término
    if (busqueda.trim() !== "") {
        const term = busqueda.toLowerCase();
        q = query(
            productosRef,
            where("empresaId", "==", empresaId),
            orderBy("nombre"),
            startAt(term),
            endAt(term + "\uf8ff")
        );
    }
    
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
}
export const PAGE_SIZE = 5;
export const getProductosByEmpresaPagina = async (empresaId, cursor = null, busqueda = "") => {
    let ref = collection(db, "productos");
    
    // Construir query paso a paso
    let constraints = [
        where("empresaId", "==", empresaId),
        orderBy("nombre")
    ];
    
    // Solo aplicar filtro de búsqueda si hay término
    if (busqueda.trim() !== "") {
        const term = busqueda.toLowerCase();
        constraints.push(
            startAt(term),
            endAt(term + "\uf8ff")
        );
    }
    
    // Aplicar cursor si existe (paginación)
    if (cursor) {
        constraints.push(startAfter(cursor));
    }
    
    // Aplicar límite
    constraints.push(limit(PAGE_SIZE));
    
    // Crear query final
    let q = query(ref, ...constraints);
    
    const snapshot = await getDocs(q);
    const productos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    
    return { productos, lastVisible };
};
