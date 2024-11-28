import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../CartContext';
import { auth, db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, getDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import '../styles/Home.css';

function Home() {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]); // Mover aquí el estado
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState({});
  const [userEmail, setUserEmail] = useState('');

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
  

  // Nuevo useEffect para los más vendidos
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const productsCollection = collection(db, 'productos');
        const bestSellersQuery = query(
          productsCollection,
          orderBy('sales', 'desc'),
          limit(5) // Mostrar los 5 productos más vendidos
        );
        const bestSellersSnapshot = await getDocs(bestSellersQuery);
        const bestSellersList = bestSellersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBestSellers(bestSellersList);
      } catch (error) {
        console.error('Error al obtener los productos más vendidos:', error);
      }
    };

    fetchBestSellers();
  }, []);

  const handleAddToCart = (product) => {
    const quantity = selectedQuantity[product.id] || 1;
    
    if (!auth.currentUser) {
      // Si no está logueado, redirige a la página de login
      navigate('/login');
    } else if (quantity > product.stock) {
      alert(`No hay suficiente stock para ${product.name}`);
    } else {
      addToCart({ ...product, quantity });
      alert(`Se agregó ${quantity} unidad(es) de ${product.name} al carrito`);
    }
  };
  

  const handleQuantityChange = (productId, value) => {
    setSelectedQuantity((prev) => ({
      ...prev,
      [productId]: parseInt(value, 10) || 1,
    }));
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteDoc(doc(db, 'productos', productId));
        setProducts(products.filter((product) => product.id !== productId));
        alert('Producto eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      }
    }
  };

  const categories = [...new Set(products.map((product) => product.category))];

  return (
    <div className="home-container">
      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div>
          {userEmail && (
            <div className="welcome-message">
              <h2>Bienvenido, {userEmail}</h2>
            </div>
          )}

          {/* Productos más vendidos */}
          <div className="best-sellers-section">
            <h2>Productos Más Vendidos</h2>
            <div className="products-list">
              {bestSellers.map((product) => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => navigate(`/product-details/${product.id}`)}
                >
                  <img src={product.imageUrl} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>Precio: ${product.price}</p>
                  <p>Stock: {product.stock}</p>
                  <p>Ventas: {product.sales || 0}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={product.stock <= 0}
                  >
                    Agregar al Carrito
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Todos los productos */}
          <h2>Todos los Productos</h2>
          <div className="products-list">
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => navigate(`/product-details/${product.id}`)}
              >
                <img src={product.imageUrl} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Precio: ${product.price}</p>
                <p>Stock: {product.stock}</p>
                <div className="quantity-selector">
                  <label htmlFor={`quantity-${product.id}`}>Cantidad:</label>
                  <input
                    type="number"
                    id={`quantity-${product.id}`}
                    value={selectedQuantity[product.id] || 1}
                    min="1"
                    max={product.stock}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  disabled={product.stock <= 0}
                >
                  Agregar al Carrito
                </button>

                {isAdmin && (
                  <div className="admin-buttons">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-product/${product.id}`);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProduct(product.id);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Categorías */}
          {categories.map((category) => (
            <div key={category}>
              <h2>{category}</h2>
              <div className="products-list">
                {products
                  .filter((product) => product.category === category)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="product-card"
                      onClick={() => navigate(`/product-details/${product.id}`)}
                    >
                      <img src={product.imageUrl} alt={product.name} />
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <p>Precio: ${product.price}</p>
                      <p>Stock: {product.stock}</p>
                      <div className="quantity-selector">
                        <label htmlFor={`quantity-${product.id}`}>Cantidad:</label>
                        <input
                          type="number"
                          id={`quantity-${product.id}`}
                          value={selectedQuantity[product.id] || 1}
                          min="1"
                          max={product.stock}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={product.stock <= 0}
                      >
                        Agregar al Carrito
                      </button>

                      {isAdmin && (
                        <div className="admin-buttons">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/edit-product/${product.id}`);
                            }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(product.id);
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
