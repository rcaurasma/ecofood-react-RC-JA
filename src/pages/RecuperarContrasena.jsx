import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";

export default function RecuperarContrasena() {
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      Swal.fire({
        title: "Correo enviado",
        text: "Revisa tu correo para restablecer la contraseña.",
        icon: "success",
        confirmButtonText: "Volver al Login"
      }).then(() => {
        navigate("/login");
      });
      setResetEmail("");
    } catch (error) {
      Swal.fire("Error", "No se pudo enviar el correo: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="container mt-5">
              <h2 className="card-title text-center mb-4">Recuperar Contraseña</h2>
              <p className="text-muted text-center mb-4">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              </p>
              
              <form onSubmit={handleResetPassword}>
                <div className="mb-3">
                  <label className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Ingresa tu correo electrónico"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-warning"
                    disabled={loading}
                  >
                    {loading ? "Enviando..." : "Enviar correo de recuperación"}
                  </button>
                </div>
              </form>
              
              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => navigate("/login")}
                >
                  Volver al Login
                </button>
              </div>
            </div>
        
  );
}