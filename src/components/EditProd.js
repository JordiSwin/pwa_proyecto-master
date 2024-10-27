import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams } from 'react-router-dom';
import '../styles/ProductForm.css';

function EditProductForm() {
  const { productId } = useParams(); // Obtener el ID del producto de la URL
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'productos', productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const data = productSnap.data();
          setProductName(data.name);
          setProductDescription(data.description);
          setProductPrice(data.price);
          setProductStock(data.stock);
          setExistingImageUrl(data.imageUrl);
        } else {
          alert('El producto no existe.');
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const productRef = doc(db, 'productos', productId);
      let imageUrl = existingImageUrl;

      // Subir una nueva imagen si el usuario seleccionó una
      if (productImage) {
        const imageRef = ref(storage, `productos/${productImage.name}`);
        await uploadBytes(imageRef, productImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Actualizar los datos del producto en Firestore
      await updateDoc(productRef, {
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
        stock: parseInt(productStock, 10),
        imageUrl: imageUrl
      });

      alert('Producto actualizado correctamente');
      setProductImage(null);
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      alert('Hubo un error al actualizar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <h2>Editar Producto</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="productName">Nombre del Producto</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="productDescription">Descripción del Producto</label>
          <textarea
            id="productDescription"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
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
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="productStock">Stock del Producto</label>
          <input
            type="number"
            id="productStock"
            value={productStock}
            onChange={(e) => setProductStock(e.target.value)}
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
          />
          {existingImageUrl && <img src={existingImageUrl} alt="Producto actual" className="existing-image" />}
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Actualizando...' : 'Actualizar Producto'}
        </button>
      </form>
    </div>
  );
}

export default EditProductForm;
