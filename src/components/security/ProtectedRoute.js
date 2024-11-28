import React from 'react';

const ProtectedRoute = ({ user, children, fallbackComponent }) => {
  if (!user) {
    // Renderiza un componente alternativo si no está autenticado
    return fallbackComponent || <p>Debes iniciar sesión para acceder a esta sección.</p>;
  }
  return children; // Renderiza los hijos si el usuario está autenticado
};

export default ProtectedRoute;
