import { db, secondaryAuth } from "./firebase";
import {
collection, query, where, getDocs, addDoc,
updateDoc, deleteDoc, setDoc, doc
} from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";



export const getClientes = async () => {
const q = query(collection(db, "usuarios"), where("tipo", "==", "cliente"));
const snapshot = await getDocs(q);
return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
export const addCliente = async (clienteData) => {
return await addDoc(collection(db, "usuarios"), {
...clienteData,
tipo: "cliente"
});
};
export const updateCliente = async (id, clienteData) => {
const ref = doc(db, "usuarios", id);
return await updateDoc(ref, clienteData);
};
export const deleteCliente = async (id) => {
const ref = doc(db, "usuarios", id);
return await deleteDoc(ref);
};
export const registrarClienteConAuth = async (datos) => {
  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, datos.email, datos.password);
    await sendEmailVerification(cred.user);
    
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nombre: datos.nombre || "",
      comuna: datos.comuna || "",
      direccion: datos.direccion || "",
      telefono: datos.telefono || "",
      tipo: "cliente",
      email: datos.email || "",
      fechaCreacion: new Date().toISOString()
    });
    
    await secondaryAuth.signOut();
    return cred;
  } catch (error) {
    console.error("Error registrando cliente:", error);
    throw error;
  }
};