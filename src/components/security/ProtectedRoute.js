import React from 'react';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    alert("Necesitas iniciar sesión para ver esta página.");
    return null;  // Retorna null para evitar renderizar la página si no está autenticado
  }
  return children; // Renderiza los hijos si el usuario está autenticado
};

export default ProtectedRoute;
