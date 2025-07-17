import { Outlet } from "react-router-dom";
import NavAdmin from "./NavAdmin";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <NavAdmin />
      <main className="container mt-3">
        <Outlet />
      </main>
    </div>
  );
}