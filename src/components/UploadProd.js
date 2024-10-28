import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '../firebaseConfig';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import '../styles/ProductForm.css';

function UploadProd() {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [productStock, setProductStock] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminRole = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const userRef = doc(db, 'usuarios', currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists() && userSnap.data().role === 'admin') {
            setIsAdmin(true);
          } else {
            alert('No tienes permisos para acceder a esta página.');
            navigate('/');
          }
        } catch (error) {
          console.error('Error al verificar el rol del usuario:', error);
          alert('Hubo un error al verificar tu rol.');
          navigate('/');
        }
      } else {
        alert('Debes iniciar sesión para acceder a esta página.');
        navigate('/login');
      }
    };

    checkAdminRole();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productImage) {
      alert('Por favor, selecciona una imagen.');
      return;
    }

    setIsLoading(true);

    try {
      // Subir la imagen a Firebase Storage
      const imageRef = ref(storage, `productos/${productImage.name}`);
      await uploadBytes(imageRef, productImage);

      // Obtener la URL de descarga de la imagen
      const imageUrl = await getDownloadURL(imageRef);

      // Crear el documento del producto en Firestore
      await addDoc(collection(db, 'productos'), {
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
        imageUrl: imageUrl,
        stock: parseInt(productStock, 10),
        category: productCategory,
        reviews: [], // Iniciar el campo de comentarios vacío
      });

      alert('Producto subido correctamente');
      setProductName('');
      setProductDescription('');
      setProductPrice('');
      setProductImage(null);
      setProductStock('');
      setProductCategory('');
    } catch (error) {
      console.error('Error al subir el producto:', error);
      alert('Hubo un error al subir el producto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isAdmin && (
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
            <label htmlFor="productStock">Stock del Producto</label>
            <input
              type="number"
              id="productStock"
              value={productStock}
              onChange={(e) => setProductStock(e.target.value)}
              placeholder="Introduce el stock disponible"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="productCategory">Categoría del Producto</label>
            <select
              id="productCategory"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              required
            >
              <option value="">Seleccionar Categoría</option>
              <option value="Baño">Baño</option>
              <option value="Recámara">Recámara</option>
              <option value="Comedor">Comedor</option>
              <option value="Cocina">Cocina</option>
              <option value="Sala">Sala</option>
              {/* Agregar más categorías si es necesario */}
            </select>
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
    )
  );
}

export default UploadProd;
