import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { CartContext } from '../CartContext';
import '../styles/ProductDetail.css';

function ProductDetail() {
  const { productId } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const productRef = doc(db, 'productos', productId);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        setProduct({ id: productId, ...productSnap.data() });
      } else {
        console.error("El producto no existe.");
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    alert(`Se agregó ${quantity} unidad(es) de ${product.name} al carrito`);
  };

  if (!product) {
    return <p>Cargando producto...</p>;
  }

  return (
    <div className="product-detail">
      <img src={product.imageUrl} alt={product.name} className="product-detail-image" />
      <div className="product-detail-info">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>Precio: ${product.price}</p>
        <p>Stock: {product.stock}</p>
        <input
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value)), product.stock))}
        />
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          {product.stock <= 0 ? 'Agotado' : 'Agregar al Carrito'}
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
