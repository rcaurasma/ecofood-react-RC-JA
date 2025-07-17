import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { AuthContext } from "./AuthContext"; // Asegúrate de tener este archivo separado
import { getUserData } from "../services/userService";
export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null); // Firebase Auth
const [userData, setUserData] = useState(null); // Firestore: nombre, tipo, etc.
const [loading, setLoading] = useState(true); // Carga completa
useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
if (firebaseUser) {
setUser(firebaseUser);
try {
const data = await getUserData(firebaseUser.uid);
data.uid = firebaseUser.uid;
setUserData(data);
} catch (error) {
console.error("Error cargando datos de Firestore:", error);
setUserData(null);
}
} else {
setUser(null);
setUserData(null);
}
setLoading(false);
});
return () => unsubscribe();
}, []);
return (
<AuthContext.Provider value={{ user, userData, loading }}>
{children}
</AuthContext.Provider>
);
};