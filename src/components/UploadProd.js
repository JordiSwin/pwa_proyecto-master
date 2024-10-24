import React, { useState } from 'react';
import '../styles/ProductForm.css'; // Asumiendo que vas a agregar estilos personalizados

function ProductForm() {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Aquí puedes manejar el envío del formulario
    console.log('Nombre:', productName);
    console.log('Descripción:', productDescription);
    console.log('Precio:', productPrice);
    console.log('Imagen:', productImage);


    alert('Producto subido correctamente');
  };

  return (
    <div className="product-form-container">
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

      <h2>Subir Nuevo Producto</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="productName">Nombre del Producto</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Introduce el nombre del producto"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="productDescription">Descripción del Producto</label>
          <textarea
            id="productDescription"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Introduce una descripción"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="productPrice">Precio del Producto</label>
          <input
            type="number"
            id="productPrice"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="Introduce el precio"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="productImage">Imagen del Producto</label>
          <input
            type="file"
            id="productImage"
            accept="image/*"
            onChange={(e) => setProductImage(e.target.files[0])}
            required
          />
        </div>

        <button type="submit" className="submit-btn">Subir Producto</button>
      </form>
    </div>
  );
}

export default ProductForm;
