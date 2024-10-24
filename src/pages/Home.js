import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../CartContext';
import { auth, db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import '../styles/Home.css';

function Home() {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // Estado para los productos
  const [loading, setLoading] = useState(true); // Estado de carga

  // Función para obtener los productos de Firestore
  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'productos');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      setLoading(false);
    }
  };

  // Usar useEffect para obtener los productos al cargar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!auth.currentUser) {
      navigate('/login'); // Redirigir a la página de login si no está autenticado
    } else {
      addToCart(product);
      alert('Producto agregado al carrito');
    }
  };

  return (
    <div className="home-container">
      <div className="banner">
        <img src="/images/banner.jpg" alt="Promoción" className="banner-img" />
        <div className="banner-text">
          <h1>Bienvenido a la Tienda de Limpieza</h1>
          <p>Encuentra aquí los mejores productos de limpieza</p>
        </div>
      </div>

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
                <button onClick={() => handleAddToCart(product)}>
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
