import React from 'react';
import { useLocation } from 'react-router-dom';

function Receipt() {
  const location = useLocation();
  const cart = location.state?.cart || [];

  // Calcular el precio total
  const totalPrice = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);

  return (
    <div className="receipt-container">
      <h1>Recibo de Compra</h1>
      <div className="receipt-items">
        {cart.map((product, index) => (
          <div key={index} className="receipt-item">
            <h2>{product.name}</h2>
            <p>Precio: ${product.price}</p>
            <p>Cantidad: {product.quantity}</p>
          </div>
        ))}
      </div>
      <h2>Total: ${totalPrice}</h2>
    </div>
  );
}

export default Receipt;
