import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await cred.user.reload();

      if (!cred.user.emailVerified) {
        Swal.fire(
          "Correo no verificado",
          "Debes verificar tu correo antes de iniciar sesión.",
          "warning"
        );
        return;
      }
      
      const { getUserData } = await import("../services/userService");
      const datos = await getUserData(cred.user.uid);

      Swal.fire(
        "Bienvenido",
        `Hola ${datos.nombre} (Tipo: ${datos.tipo})`,
        "success"
      );

      if (datos.tipo === "admin") navigate("/admin/dashboard");
      else if (datos.tipo === "cliente") navigate("/cliente/dashboard");
      else if (datos.tipo === "empresa") navigate("/empresa/dashboard");

    } catch {
      Swal.fire("Error", "Credenciales incorrectas o fallo de red", "error");
    }
  };

  return (
    // Wrapper con estilo para limpiar cualquier interferencia
    <div className="auth-page public-page" style={{ 
      position: 'relative', 
      zIndex: 10, 
      minHeight: '100vh',
      paddingTop: '0', 
      marginTop: '0' 
    }}>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '15px'
            }}>
              <div className="card-body p-5">
                <h2 className="text-center mb-4" style={{ color: '#333' }}>
                  <i className="fas fa-leaf text-success me-2"></i>
                  EcoFood
                </h2>
                <h3 className="text-center mb-4" style={{ color: '#666' }}>
                  Iniciar Sesión
                </h3>

                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label" style={{ color: '#333' }}>
                      <i className="fas fa-envelope me-2"></i>
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      style={{ 
                        backgroundColor: 'white',
                        border: '2px solid #e9ecef',
                        color: '#333'
                      }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength="50"
                      required
                      placeholder="tu@correo.com"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label" style={{ color: '#333' }}>
                      <i className="fas fa-lock me-2"></i>
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      style={{ 
                        backgroundColor: 'white',
                        border: '2px solid #e9ecef',
                        color: '#333'
                      }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      maxLength="50"
                      required
                      placeholder="Tu contraseña"
                    />
                  </div>
                  
                  <div className="d-grid gap-2 mb-3">
                    <button 
                      type="submit" 
                      className="btn btn-success btn-lg"
                      style={{
                        backgroundColor: '#28a745',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '12px'
                      }}
                    >
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Iniciar Sesión
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-link"
                      style={{ color: '#007bff' }}
                      onClick={() => navigate("/recuperar")}
                    >
                      <i className="fas fa-question-circle me-1"></i>
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </form>

                <hr style={{ color: '#ccc' }} />
                
                <div className="text-center">
                  <p className="mb-2" style={{ color: '#666' }}>
                    ¿No tienes cuenta?
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    style={{
                      borderRadius: '10px',
                      padding: '10px 20px'
                    }}
                    onClick={() => navigate("/registro")}
                  >
                    <i className="fas fa-user-plus me-2"></i>
                    Regístrate aquí
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}