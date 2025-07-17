import { 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  collection, 
  getDocs 
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Obtiene los datos de una empresa por su ID
 */
export const obtenerEmpresaPorId = async (empresaId) => {
  try {
    const empresaRef = doc(db, "empresas", empresaId);
    const empresaSnap = await getDoc(empresaRef);
    
    if (empresaSnap.exists()) {
      return { id: empresaSnap.id, ...empresaSnap.data() };
    } else {
      throw new Error("Empresa no encontrada");
    }
  } catch (error) {
    console.error("Error al obtener empresa:", error);
    throw error;
  }
};

/**
 * Obtiene los datos de una empresa por su UID de usuario
 */
export const obtenerEmpresaPorUID = async (uid) => {
  try {
    const q = query(collection(db, "empresas"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } else {
      throw new Error("Empresa no encontrada");
    }
  } catch (error) {
    console.error("Error al obtener empresa por UID:", error);
    throw error;
  }
};

/**
 * Actualiza el perfil de una empresa
 */
export const actualizarPerfilEmpresa = async (empresaId, datosActualizados) => {
  try {
    const empresaRef = doc(db, "empresas", empresaId);
    
    // No permitir actualización de campos críticos
    // eslint-disable-next-line no-unused-vars
    const { rut, correo, uid, fechaCreacion, ...datosPermitidos } = datosActualizados;
    
    await updateDoc(empresaRef, {
      ...datosPermitidos,
      fechaActualizacion: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error("Error al actualizar perfil de empresa:", error);
    throw error;
  }
};

/**
 * Valida los datos del perfil de empresa
 */
export const validarPerfilEmpresa = (datos) => {
  const errores = {};
  
  if (!datos.nombre || datos.nombre.trim().length < 3) {
    errores.nombre = "El nombre debe tener al menos 3 caracteres";
  }
  
  if (!datos.direccion || datos.direccion.trim().length < 5) {
    errores.direccion = "La dirección debe tener al menos 5 caracteres";
  }
  
  if (!datos.telefono || datos.telefono.trim().length < 8) {
    errores.telefono = "El teléfono debe tener al menos 8 caracteres";
  }
  
  if (!datos.descripcion || datos.descripcion.trim().length < 10) {
    errores.descripcion = "La descripción debe tener al menos 10 caracteres";
  }
  
  return {
    esValido: Object.keys(errores).length === 0,
    errores
  };
};
