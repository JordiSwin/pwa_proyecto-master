import React, { useContext } from 'react';
import { CartContext } from '../CartContext';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    if (!auth.currentUser) {
      // Si el usuario no está autenticado, redirigir a la página de login
      navigate('/login');
    } else {
      addToCart(product);
      alert('Producto agregado al carrito');
    }
  };

  return (
    <div>
      <h1>Bienvenido a la Tienda</h1>
      {/* Ejemplo de producto */}
      <div>
        <h2>Producto Ejemplo</h2>
        <button onClick={() => handleAddToCart({ name: 'Producto Ejemplo', price: 100 })}>
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}

export default Home;
