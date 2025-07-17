import { useEffect, useState } from "react";
import { getUserData } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import CardProducto from '../components/CardProducto';
import CerrarSesion from "../components/CerrarSesion";
import { useNavigate } from "react-router-dom";

function Home() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Home component mounted, user:", user);
    const fetch = async () => {
      try {
        const datos = await getUserData(user.uid);
        setUserData(datos);
        console.log("User data loaded:", datos);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    if (user) fetch();
  }, [user]);

  return (
    <div className="container mt-4 home-bg" style={{ minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>¡Bienvenido a EcoFood!</h2>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate("/cliente/dashboard")}
        >
          Volver al Dashboard
        </button>
      </div>
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






