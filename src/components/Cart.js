import React, { useContext } from 'react';
import { CartContext } from '../CartContext';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate
import '../styles/Cart.css';

function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();  // Define el hook de navegación

  const handlePurchase = async () => {
    try {
      for (const product of cart) {
        const productRef = doc(db, 'productos', product.id);
        const newStock = product.stock - product.quantity;

        if (newStock >= 0) {
          await updateDoc(productRef, { stock: newStock });
        } else {
          alert(`No hay suficiente stock para ${product.name}`);
          return;
        }
      }

      // Compra realizada, redirigir al recibo
      navigate('/recibo', { state: { cart } }); // Pasar el carrito al recibo
      clearCart();
    } catch (error) {
      console.error('Error al realizar la compra:', error);
      alert('Hubo un error al realizar la compra');
    }
  };

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
              <p>Cantidad: {product.quantity}</p>
              <button onClick={() => removeFromCart(product.id)}>
                Eliminar
              </button>
            </div>
          ))}
          <button onClick={handlePurchase}>Comprar</button>
          <button onClick={clearCart} className="clear-btn">
            Vaciar Carrito
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
