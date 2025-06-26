import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { saveUserData } from "../services/userService";
import validator from "validator";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    return pwd.length >= 6 && /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      Swal.fire(
        "Contraseña débil",
        "La contraseña debe tener al menos 6 caracteres y combinar letras y números.",
        "warning"
      );
      return;
    }
    if (!validator.isEmail(email)) {
      Swal.fire("Correo inválido", "Por favor ingresa un correo válido.", "warning");
      return;
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await saveUserData(cred.user.uid, {
        nombre,
        email,
        direccion,
        comuna,
        telefono,
        tipo: "cliente"
      });
      await sendEmailVerification(cred.user);
      Swal.fire(
        "Verifica tu correo",
        "Te enviamos un correo de verificación. Debes verificarlo antes de iniciar sesión.",
        "info"
      );
      navigate("/login");
    } catch (error) {
      Swal.fire("Error", "No se pudo registrar: " + error.message, "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro Cliente</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input type="text" className="form-control" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Comuna</label>
          <input type="text" className="form-control" value={comuna} onChange={(e) => setComuna(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono (opcional)</label>
          <input type="text" className="form-control" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo de usuario</label>
          <input type="text" className="form-control" value="cliente" disabled />
        </div>
        <button type="submit" className="btn btn-success">Registrar</button>
      </form>
    </div>
  );
}