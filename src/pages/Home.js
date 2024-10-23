import React, { useContext } from 'react';
import { CartContext } from '../CartContext';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    if (!auth.currentUser) {
      navigate('/login'); // Redirigir a la página de login si no está autenticado
    } else {
      addToCart(product);
      alert('Producto agregado al carrito');
    }
  };

  const mostSearchedProducts = [
    { name: 'Detergente Líquido', price: 50, image: '/images/detergente.jpg' },
    { name: 'Desinfectante Multiusos', price: 70, image: '/images/desinfectante.jpg' },
    { name: 'Escoba Duradera', price: 25, image: '/images/escoba.jpg' },
  ];

  const otherProducts = [
    { name: 'Trapo de Microfibra', price: 15, image: '/images/trapo.jpg' },
    { name: 'Jabón Líquido', price: 30, image: '/images/jabon.jpg' },
  ];

  return (
    <div className="home-container">
      {/* Banner */}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="banner">
        <img src="/images/banner.jpg" alt="Promoción" className="banner-img" />
        <div className="banner-text">
          <h1>Bienvenido a la Tienda de Limpieza</h1>
          <p>Encuentra aquí los mejores productos de limpieza</p>
        </div>
      </div>

      {/* Sección de productos más buscados */}
      <div className="most-searched">
        <h2>Productos Más Buscados</h2>
        <div className="products-list">
          {mostSearchedProducts.map((product, index) => (
            <div key={index} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>Precio: ${product.price}</p>
              <button onClick={() => handleAddToCart(product)}>Agregar al Carrito</button>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de otros productos */}
      <div className="other-products">
        <h2>Otros Productos</h2>
        <div className="products-list">
          {otherProducts.map((product, index) => (
            <div key={index} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>Precio: ${product.price}</p>
              <button onClick={() => handleAddToCart(product)}>Agregar al Carrito</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
