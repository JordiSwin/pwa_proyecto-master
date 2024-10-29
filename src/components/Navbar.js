import React, { useContext } from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext';
import '../styles/Navbar.css';

function Navbar({ user, isAdmin }) {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);

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
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        <h2>Mi Tienda PWA</h2>
      </div>

      <div className="navbar-buttons">
        {/* Mostrar el botón del carrito siempre que el usuario esté autenticado */}
        {user && (
          <div className="navbar-cart" onClick={() => navigate('/cart')}>
            🛒
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </div>
        )}

        {/* Mostrar el botón para agregar productos solo para administradores */}
        {isAdmin && (
          <><button onClick={() => navigate('/upload-product')} className="navbar-btn upload-btn">
            ➕ Subir Producto
          </button><button onClick={() => navigate('/Ver Productos')} className="navbar-btn profile-btn">
              Ver productotes
            </button></>

          
          
        )}

        {/* Mostrar botones de inicio de sesión, registro, y perfil basado en el estado de autenticación */}
        {user ? (
          <>
            <button onClick={() => navigate('/edit-profile')} className="navbar-btn profile-btn">
              Editar Perfil
            </button>
            <button onClick={handleLogout} className="navbar-btn logout-btn">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')} className="navbar-btn login-btn">
              Iniciar Sesión
            </button>
            <button onClick={() => navigate('/register')} className="navbar-btn register-btn">
              Registrarse
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
