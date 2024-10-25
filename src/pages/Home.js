import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../CartContext';
import { auth, db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import '../styles/Home.css';

function Home() {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'productos');
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const [quantity, setQuantity] = useState({}); // Estado para manejar la cantidad por producto

  const handleQuantityChange = (productId, value) => {
    setQuantity({
      ...quantity,
      [productId]: Math.min(Math.max(value, 1), products.find((p) => p.id === productId)?.stock),
    });
  };

  const handleAddToCart = (product) => {
    if (!auth.currentUser) {
      navigate('/login');
    } else {
      const selectedQuantity = quantity[product.id] || 1;
      addToCart({ ...product, quantity: selectedQuantity });
      alert(`Se agregó ${selectedQuantity} unidad(es) de ${product.name} al carrito`);
    }
  };

  const renderProductCard = (product) => (
    <div key={product.id} className="product-card">
      <img src={product.imageUrl} alt={product.name} className="product-image" />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>Precio: ${product.price}</p>
      <p>Stock: {product.stock}</p>
      <input
        type="number"
        min="1"
        max={product.stock}
        value={quantity[product.id] || 1}
        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
      />
      <button
        className="add-to-cart-btn"
        onClick={() => handleAddToCart(product)}
        disabled={product.stock <= 0}
      >
        {product.stock <= 0 ? 'Agotado' : 'Agregar al Carrito'}
      </button>
    </div>
  );

  return (
    <div className="home-container">
      <div className="banner">
        <img src="public/images/IMG-20180813-WA0011.jpg" style={{height: "200px"}} alt="Banner de la tienda" className="banner-img" />
      </div>

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <>
          <h2>Comedor</h2>
          <div className="slider">
            {products.map((product) => renderProductCard(product))}
          </div>

          <h2>Baño</h2>
          <div className="slider">
            {products.map((product) => renderProductCard(product))}
          </div>

          <h2>Roperos</h2>
          <div className="slider">
            {products.map((product) => renderProductCard(product))}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;


