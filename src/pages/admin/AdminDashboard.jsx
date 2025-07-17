import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { getAdministradores } from "../../services/adminFirebase";
import { getClientes } from "../../services/clienteFirebase";
import { getEmpresas } from "../../services/empresaFirebase";

export default function AdminDashboard() {
  const { userData } = useAuth();
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalEmpresas: 0,
    totalAdmins: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const [clientes, empresas, admins] = await Promise.all([
          getClientes(),
          getEmpresas(),
          getAdministradores()
        ]);

        setStats({
          totalClientes: clientes.length,
          totalEmpresas: empresas.length,
          totalAdmins: admins.length
        });
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarEstadisticas();
  }, []);

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h1 className="mb-1">
                <i className="fas fa-tachometer-alt me-2"></i>
                Panel del Administrador
              </h1>
              <p className="mb-0">Bienvenido {userData?.nombre || 'Administrador'} - Sistema EcoFood</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <i className="fas fa-users text-info" style={{fontSize: '2.5rem'}}></i>
              <h3 className="mt-2">{stats.totalClientes}</h3>
              <p className="text-muted">Clientes Registrados</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <i className="fas fa-building text-success" style={{fontSize: '2.5rem'}}></i>
              <h3 className="mt-2">{stats.totalEmpresas}</h3>
              <p className="text-muted">Empresas Activas</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <i className="fas fa-user-shield text-warning" style={{fontSize: '2.5rem'}}></i>
              <h3 className="mt-2">{stats.totalAdmins}</h3>
              <p className="text-muted">Administradores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}