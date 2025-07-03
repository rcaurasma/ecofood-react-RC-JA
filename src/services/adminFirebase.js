import { db, secondaryAuth } from "./firebase";
import {
  collection, query, where, getDocs,
  updateDoc, deleteDoc, setDoc, doc
} from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

/**
 * Obtiene todos los administradores de la base de datos
 */
export const getAdministradores = async () => {
  const q = query(collection(db, "usuarios"), where("tipo", "==", "admin"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Actualiza los datos de un administrador existente
 */
export const updateAdministrador = async (id, adminData) => {
  const ref = doc(db, "usuarios", id);
  return await updateDoc(ref, adminData);
};

/**
 * Elimina un administrador de la base de datos
 */
export const deleteAdministrador = async (id) => {
  const ref = doc(db, "usuarios", id);
  return await deleteDoc(ref);
};

/**
 * Registra un nuevo administrador con autenticación Firebase
 * @param {Object} datos - Datos del administrador {nombre, email, password}
 */
export const registrarAdminConAuth = async (datos) => {
  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, datos.email, datos.password);
    await sendEmailVerification(cred.user);
    
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nombre: datos.nombre || "",
      email: datos.email || "",
      tipo: "admin",
      fechaCreacion: new Date().toISOString()
    });
    
    await secondaryAuth.signOut();
    return cred;
  } catch (error) {
    console.error("Error registrando administrador:", error);
    throw error;
  }
};
