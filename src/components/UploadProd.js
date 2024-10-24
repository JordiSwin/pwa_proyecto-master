import React, { useState } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../styles/ProductForm.css';

function ProductForm() {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productImage) {
      alert('Por favor, selecciona una imagen.');
      return;
    }

    setIsLoading(true);

    try {
      // Crear una referencia única para la imagen en Firebase Storage
      const imageRef = ref(storage, `productos/${productImage.name}`);

      // Subir la imagen seleccionada a Firebase Storage
      await uploadBytes(imageRef, productImage);

      // Obtener la URL de descarga de la imagen subida
      const imageUrl = await getDownloadURL(imageRef);

      // Crear el documento del producto en Firestore
      await addDoc(collection(db, 'productos'), {
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
        imageUrl: imageUrl,
      });

      alert('Producto subido correctamente');

      // Limpiar los campos del formulario
      setProductName('');
      setProductDescription('');
      setProductPrice('');
      setProductImage(null);
    } catch (error) {
      console.error('Error al subir el producto:', error);
      alert('Hubo un error al subir el producto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-form-container">
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

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Subiendo...' : 'Subir Producto'}
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
