import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await cred.user.reload(); // Fuerza recarga del usuario para emailVerified
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
      navigate("/home");
    } catch {
      Swal.fire("Error", "Credenciales incorrectas o fallo de red", "error");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      Swal.fire(
        "Correo enviado",
        "Revisa tu correo para restablecer la contraseña.",
        "info"
      );
      setShowReset(false);
      setResetEmail("");
    } catch (error) {
      Swal.fire("Error", "No se pudo enviar el correo: " + error.message, "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
        <button
          type="button"
          className="btn btn-link"
          onClick={() => setShowReset(!showReset)}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </form>
      <button
        type="button"
        className="btn btn-success mt-3"
        onClick={() => navigate("/registro")}
      >
        ¿No tienes cuenta? Regístrate aquí
      </button>
      {showReset && (
        <form onSubmit={handleResetPassword} className="mt-3">
          <div className="mb-3">
            <label className="form-label">Correo para recuperar contraseña</label>
            <input
              type="email"
              className="form-control"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-warning">Enviar correo de recuperación</button>
        </form>
      )}
    </div>
  );
}