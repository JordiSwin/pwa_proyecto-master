import React, { useContext } from 'react';
import { CartContext } from '../CartContext';
import '../styles/Cart.css'; // Importar los estilos

function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  // Calcular el total del carrito
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h1 className="cart-title">Carrito de Compras</h1>
      {cart.length === 0 ? (
        <p className="cart-empty">El carrito está vacío.</p>
      ) : (
        <div>
          {cart.map((product, index) => (
            <div key={index} className="cart-item">
              <div>
                <h2>{product.name}</h2>
                <p>Precio: ${product.price}</p>
                <p>Cantidad: {product.quantity}</p>
              </div>
              <div className="cart-item-actions">
                <button onClick={() => removeFromCart(product.name)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <p>Total: ${total}</p>
          </div>
          <button className="cart-clear-btn" onClick={clearCart}>
            Vaciar Carrito
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
