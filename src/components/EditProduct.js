import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../styles/EditProduct.css';

const CATEGORIES = [
  'Muebles para Baño',
  'Muebles para Recámara',
  'Muebles para Comedor',
  'Cocina',
  'Limpieza',
  'Decoración',
];

function EditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState(''); // Nuevo estado para la categoría
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'productos', productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const productData = productSnap.data();
          setProduct(productData);
          setName(productData.name);
          setDescription(productData.description);
          setPrice(productData.price);
          setStock(productData.stock);
          setCategory(productData.category); // Inicializar categoría
        } else {
          alert('Producto no encontrado');
          navigate('/');
        }
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      let imageUrl = product.imageUrl;

      // Si se selecciona una nueva imagen, se sube a Firebase Storage
      if (image) {
        const imageRef = ref(storage, `productos/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Actualizar el producto en Firestore
      const productRef = doc(db, 'productos', productId);
      await updateDoc(productRef, {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        category, // Actualizar la categoría
        imageUrl,
      });

      alert('Producto actualizado correctamente');
      navigate('/');
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      alert('Hubo un error al actualizar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) return <p>Cargando producto...</p>;

  return (
    <div className="edit-product-container">
      <h2>Editar Producto</h2>
      <form onSubmit={handleSubmit} className="edit-product-form">
        <div className="form-group">
          <label htmlFor="name">Nombre del Producto</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Precio</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Categoría</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Imagen del Producto</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Actualizando...' : 'Actualizar Producto'}
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
