import React from 'react';
import { useLocation } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import '../styles/ReceiptPage.css';

function Receipt() {
  const location = useLocation();
  const cart = location.state?.cart || [];
  const userEmail = auth.currentUser?.email || 'Usuario no identificado';

  // Calcular el precio total
  const totalPrice = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);

  return (
    <div className="receipt-container">
      <h1>Recibo de Compra</h1>
      <p className="user-email">Comprador: {userEmail}</p>
      <div className="receipt-items">
        {cart.map((product, index) => (
          <div key={index} className="receipt-item">
            <h2>{product.name}</h2>
            <p>Precio: ${product.price}</p>
            <p>Cantidad: {product.quantity}</p>
            <p>Total Producto: ${product.price * product.quantity}</p>
          </div>
        ))}
      </div>
      <div className="receipt-total">
        <h2>Total de la compra: ${totalPrice}</h2>
      </div>
    </div>
  );
}

export default Receipt;
