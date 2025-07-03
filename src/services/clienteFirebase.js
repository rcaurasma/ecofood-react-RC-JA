import { db } from "./firebase";
import {
collection, query, where, getDocs, addDoc,
updateDoc, deleteDoc, doc
} from "firebase/firestore";
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