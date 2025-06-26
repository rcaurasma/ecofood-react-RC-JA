import { useEffect, useState } from "react";
import { getUserData } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import CardProducto from '../components/CardProducto';
import CerrarSesion from "../components/CerrarSesion";

function Home() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const datos = await getUserData(user.uid);
      setUserData(datos);
    };
    if (user) fetch();
  }, [user]);

  return (
    <div className="container mt-4 home-bg" style={{ minHeight: '100vh' }}>
      <h2>¡Bienvenido a EcoFood!</h2>
      {userData && (
        <div className="mb-3">
          <strong>Usuario:</strong> {userData.nombre} <br />
          <strong>Tipo:</strong> {userData.tipo}
        </div>
      )}
      <h1>Productos Disponibles</h1>
      <CardProducto nombre="Pan Integral" precio="$500" />
      <CardProducto nombre="Huevo" precio="$300" />
      <CardProducto nombre="Ensalada de Frutas" precio="$1200" />
      <CardProducto nombre="Ensalada de Verduras" precio="$1000" />
      <CardProducto nombre="Pescado" precio="$2500" />
      <CardProducto nombre="Leche" precio="$800" />
      <CardProducto nombre="Queso Fresco" precio="$1500" />
      <CardProducto nombre="Yogur Natural" precio="$900" />
      <CardProducto nombre="Avena" precio="$600" />
      <br></br>
      <CerrarSesion />
    </div>
  );
}

export default Home;






