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

  return (
    <div className="home-container">
      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="products-list">
          {products.length === 0 ? (
            <p>No hay productos disponibles.</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.imageUrl} alt={product.name} />
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
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                >
                  Agregar al Carrito
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
