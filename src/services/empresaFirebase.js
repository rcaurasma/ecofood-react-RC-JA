import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "empresas";

/**
 * Obtiene todas las empresas de la base de datos
 */
export const getEmpresas = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error al obtener empresas:", error);
    throw error;
  }
};

/**
 * Crea una nueva empresa en la base de datos
 */
export const createEmpresa = async (empresaData) => {
  try {
    // Verificar si ya existe una empresa con el mismo RUT
    const q = query(collection(db, COLLECTION_NAME), where("rut", "==", empresaData.rut));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const error = new Error("Ya existe una empresa con este RUT");
      error.code = "already-exists";
      throw error;
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...empresaData,
      fechaCreacion: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error al crear empresa:", error);
    throw error;
  }
};

/**
 * Actualiza los datos de una empresa existente
 */
export const updateEmpresa = async (empresaId, empresaData) => {
  try {
    const empresaRef = doc(db, COLLECTION_NAME, empresaId);
    await updateDoc(empresaRef, {
      ...empresaData,
      fechaActualizacion: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error al actualizar empresa:", error);
    throw error;
  }
};

/**
 * Elimina una empresa de la base de datos
 */
export const deleteEmpresa = async (empresaId) => {
  try {
    const empresaRef = doc(db, COLLECTION_NAME, empresaId);
    await deleteDoc(empresaRef);
  } catch (error) {
    console.error("Error al eliminar empresa:", error);
    throw error;
  }
};

/**
 * Busca empresas por nombre (función adicional para búsquedas)
 */
export const buscarEmpresasPorNombre = async (nombre) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("nombre", ">=", nombre),
      where("nombre", "<=", nombre + '\uf8ff')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error al buscar empresas:", error);
    throw error;
  }
};