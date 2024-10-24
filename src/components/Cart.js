import React, { useContext } from 'react';
import { CartContext } from '../CartContext';

function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  return (
    <div className="cart-container">
      <h1>Carrito de Compras</h1>
      {cart.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <div>
          {cart.map((product, index) => (
            <div key={index} className="cart-item">
              <h2>{product.name}</h2>
              <p>Precio: ${product.price}</p>
              <button onClick={() => removeFromCart(product.id)}>Eliminar</button>
            </div>
          ))}
          <button onClick={clearCart}>Vaciar Carrito</button>
        </div>
      )}
    </div>
  );
}

export default Cart;
