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

  const validateName = (name) => {
    // Solo letras, espacios y acentos, máximo 50 caracteres
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return name.length >= 2 && name.length <= 50 && nameRegex.test(name);
  };

  const validatePhone = (phone) => {
    // Solo números, espacios, guiones y paréntesis, máximo 50 caracteres
    const phoneRegex = /^[0-9\s\-()+ ]+$/;
    return phone.length === 0 || (phone.length >= 8 && phone.length <= 50 && phoneRegex.test(phone));
  };

  const validateAddress = (address) => {
    // Letras, números, espacios y algunos caracteres especiales, máximo 50 caracteres
    return address.length >= 5 && address.length <= 50;
  };

  const validateComuna = (comuna) => {
    // Solo letras, espacios y acentos, máximo 50 caracteres
    const comunaRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return comuna.length >= 2 && comuna.length <= 50 && comunaRegex.test(comuna);
  };

  const validateAllFields = () => {
    if (!validateName(nombre)) {
      Swal.fire(
        "Nombre inválido",
        "El nombre debe tener entre 2 y 50 caracteres y solo contener letras.",
        "warning"
      );
      return false;
    }

    if (!validator.isEmail(email)) {
      Swal.fire("Correo inválido", "Por favor ingresa un correo válido.", "warning");
      return false;
    }

    if (!validatePassword(password)) {
      Swal.fire(
        "Contraseña débil",
        "La contraseña debe tener al menos 6 caracteres y combinar letras y números.",
        "warning"
      );
      return false;
    }

    if (!validateAddress(direccion)) {
      Swal.fire(
        "Dirección inválida",
        "La dirección debe tener entre 5 y 50 caracteres.",
        "warning"
      );
      return false;
    }

    if (!validateComuna(comuna)) {
      Swal.fire(
        "Comuna inválida",
        "La comuna debe tener entre 2 y 50 caracteres y solo contener letras.",
        "warning"
      );
      return false;
    }

    if (telefono && !validatePhone(telefono)) {
      Swal.fire(
        "Teléfono inválido",
        "El teléfono debe tener entre 8 y 50 caracteres y solo contener números.",
        "warning"
      );
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validar todos los campos antes de proceder
    if (!validateAllFields()) {
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
    <div className="auth-page public-page">
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <h2 className="text-center mb-4">Registro Cliente</h2>
            <form onSubmit={handleRegister}>

        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input 
            type="text" 
            className="form-control" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            maxLength="50"
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input 
            type="email" 
            className="form-control" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            maxLength="50"
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
            maxLength="50"
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input 
            type="text" 
            className="form-control" 
            value={direccion} 
            onChange={(e) => setDireccion(e.target.value)} 
            maxLength="50"
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Comuna</label>
          <input 
            type="text" 
            className="form-control" 
            value={comuna} 
            onChange={(e) => setComuna(e.target.value)} 
            maxLength="50"
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono (opcional)</label>
          <input 
            type="tel" 
            className="form-control" 
            value={telefono} 
            onChange={(e) => setTelefono(e.target.value)} 
            maxLength="50"
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Registrar</button>
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
        </div>
      </div>
    </div>
  );
}