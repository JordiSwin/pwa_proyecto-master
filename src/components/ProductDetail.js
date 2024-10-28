import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useContext } from 'react';
import { CartContext } from '../CartContext';
import '../styles/ProductDetail.css';

function ProductDetail() {
  const { productId } = useParams();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'productos', productId);
        const productSnapshot = await getDoc(productRef);
        if (productSnapshot.exists()) {
          setProduct({ id: productSnapshot.id, ...productSnapshot.data() });
        } else {
          navigate('/'); // Redirigir si el producto no existe
        }
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  if (loading) return <p>Cargando...</p>;
  if (!product) return <p>Producto no encontrado</p>;

  return (
    <div className="product-detail-container">
      <div className="product-image-section">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
      </div>
      <div className="product-details-section">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-price">Precio: ${product.price}</p>
        <p className="product-stock">Stock disponible: {product.stock}</p>
        <p className="product-description">{product.description}</p>
        <button 
          className="add-to-cart-btn" 
          onClick={() => addToCart({ ...product, quantity: 1 })}
          disabled={product.stock <= 0}
        >
          {product.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
