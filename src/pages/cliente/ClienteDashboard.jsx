import { useNavigate } from "react-router-dom";

export default function ClienteDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h2>Bienvenido cliente</h2>
      <div className="text-center mt-3">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/home", { replace: true })}
        >
          Ver productos
        </button>
      </div>
    </div>
  );
}