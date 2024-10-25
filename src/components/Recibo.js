import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../CartContext'; // Suponiendo que ya tienes un contexto de carrito
import { db } from '../firebaseConfig'; // Firestore para guardar los recibos
import { addDoc, collection } from 'firebase/firestore';
import '../styles/ReceiptPage.css';

function ReceiptPage() {
  const { cart, clearCart } = useContext(CartContext); // Obtenemos el carrito y la función para limpiarlo
  const [receiptId, setReceiptId] = useState(null);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    // Guardar los detalles del recibo en Firestore
    const saveReceipt = async () => {
      try {
        const receiptRef = await addDoc(collection(db, 'receipts'), {
          items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalPrice: totalPrice,
          timestamp: new Date(),
        });
        setReceiptId(receiptRef.id); // Guardamos el ID del recibo
      } catch (error) {
        console.error('Error al guardar el recibo:', error);
      }
    };

    if (cart.length > 0) {
      saveReceipt();
    }
  }, [cart, totalPrice]);

  const handlePrintReceipt = () => {
    window.print(); // Permite la impresión del recibo
  };

  return (
    <div className="receipt-container">
      <h1>Recibo de Compra</h1>

      {receiptId && <p>Recibo ID: {receiptId}</p>}

      <div className="receipt-details">
        <h2>Detalles del pedido:</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index} className="receipt-item">
              <span className="item-name">{item.name}</span>
              <span className="item-quantity">x{item.quantity}</span>
              <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="total-price">
          <h3>Total a pagar: ${totalPrice.toFixed(2)}</h3>
        </div>
      </div>

      <button className="print-btn" onClick={handlePrintReceipt}>
        Imprimir Recibo
      </button>
    </div>
  );
}

export default ReceiptPage;
