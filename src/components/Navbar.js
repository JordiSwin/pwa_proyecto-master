import React, { useContext } from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);

  // Calcular el total de productos en el carrito
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      alert('Has cerrado sesión correctamente');
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Hubo un error al cerrar sesión');
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
            {/* Botón para subir producto */}
            <button onClick={() => navigate('/upload')} className="navbar-btn upload-btn">
              Subir Producto
            </button>

            {/* Botón para el carrito */}
            <button onClick={() => navigate('/cart')} className="navbar-btn cart-btn">
              🛒 ({totalItems})
            </button>

            {/* Botón para cerrar sesión */}
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
