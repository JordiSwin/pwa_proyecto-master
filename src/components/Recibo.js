import React from 'react';
import { useLocation } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../styles/ReceiptPage.css';

function Receipt() {
  const location = useLocation();
  const cart = location.state?.cart || [];
  const userEmail = auth.currentUser?.email || 'Usuario no identificado';

  // Calcular el precio total
  const totalPrice = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);

  // Función para generar el PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Título del documento
    doc.setFontSize(18);
    doc.text('Recibo de Compra', 10, 10);
    
    // Detalles del comprador
    doc.setFontSize(12);
    doc.text(`Comprador: ${userEmail}`, 10, 20);

    // Agregar tabla de productos
    const items = cart.map((product) => [
      product.name,
      `$${product.price}`,
      product.quantity,
      `$${product.price * product.quantity}`
    ]);

    doc.autoTable({
      head: [['Producto', 'Precio', 'Cantidad', 'Total']],
      body: items,
      startY: 30,
    });

    // Total final
    doc.setFontSize(14);
    doc.text(`Total de la compra: $${totalPrice}`, 10, doc.previousAutoTable.finalY + 10);

    // Descargar el PDF
    doc.save('recibo_compra.pdf');
  };

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
      <button onClick={generatePDF} className="download-btn">
        Descargar Recibo en PDF
      </button>
    </div>
  );
}

export default Receipt;
