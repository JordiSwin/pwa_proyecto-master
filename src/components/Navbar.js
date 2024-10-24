import React from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css'; // Asumiendo que vas a agregar estilos

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

  // Función para navegar al carrito si está autenticado
  const handleCartClick = () => {
    if (!auth.currentUser) {
      alert('Debes iniciar sesión para acceder al carrito.');
      navigate('/login');
    } else {
      navigate('/cart');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        <h2>Mi Tienda PWA</h2>
      </div>
      <div className="navbar-buttons">
        {auth.currentUser ? (
          <>
            <button onClick={handleCartClick} className="navbar-btn cart-btn">
              Carrito
            </button>
            <button onClick={handleLogout} className="navbar-btn logout-btn">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="navbar-btn login-btn"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate('/register')}
              className="navbar-btn register-btn"
            >
              Registrarse
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
