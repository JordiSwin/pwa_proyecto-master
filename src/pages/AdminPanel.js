import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPanel.css';

function AdminPanel() {
  const navigate = useNavigate();

  return (
    <div className="admin-panel-container">
      <h1>Panel de Administración</h1>
      <button onClick={() => navigate('/upload-product')} className="admin-btn">
        Agregar Producto
      </button>
      <button onClick={() => navigate('/edit-products')} className="admin-btn">
        Editar Productos
      </button>
      <button onClick={() => handleNavigation('/Ver Productos')} className="navbar-btn upload-btn">
              ➕ Subir Producto
            </button>
      <button onClick={() => navigate('/manage-comments')} className="admin-btn">
        Administrar Comentarios
      </button>
    </div>
  );
}

export default AdminPanel;
