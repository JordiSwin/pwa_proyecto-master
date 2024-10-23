import React from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  // Función para cerrar la sesión
  const handleLogout = async () => {
    try {
      await auth.signOut();
      alert('Has cerrado sesión correctamente');
      navigate('/login'); // Redirige al usuario a la página de inicio de sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Hubo un error al cerrar sesión');
    }
  };

  return (
    <nav>
      <h2>Mi Tienda PWA</h2>
      <div>
        {auth.currentUser ? (
          <button onClick={handleLogout}>Cerrar Sesión</button>
        ) : (
          <>
            <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
            <button onClick={() => navigate('/register')}>Registrarse</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
