import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../CartContext';
import { auth, db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import '../styles/Home.css';

function Home() {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState({}); // Estado para manejar la cantidad seleccionada
  const [userEmail, setUserEmail] = useState(''); // Estado para guardar el correo del usuario

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

    const checkAdminAndUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Setear el correo del usuario
        setUserEmail(currentUser.email);

        const userRef = doc(db, 'usuarios', currentUser.uid);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists() && userSnapshot.data().role === 'admin') {
          setIsAdmin(true);
        }
      }
    };

    fetchProducts();
    checkAdminAndUser();
  }, []);

  const handleAddToCart = (product) => {
    const quantity = selectedQuantity[product.id] || 1; // Obtener la cantidad seleccionada (predeterminada a 1)
    if (!auth.currentUser) {
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
      [productId]: parseInt(value, 10),
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
          {/* Mostrar mensaje de bienvenida */}
          {userEmail && (
            <div className="welcome-message">
              <h2>Bienvenido, {userEmail}</h2>
            </div>
          )}

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

                {/* Selección de cantidad */}
                <div className="quantity-selector">
                  <label htmlFor={`quantity-${product.id}`}>Cantidad:</label>
                  <input
                    type="number"
                    id={`quantity-${product.id}`}
                    value={selectedQuantity[product.id] || 1}
                    min="1"
                    max={product.stock}
                    onClick={(e) => e.stopPropagation()} // Evitar navegación al hacer clic en el input
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  />
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Evitar la navegación al hacer clic en el botón
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
                        e.stopPropagation(); // Evitar la navegación al hacer clic en el botón
                        navigate(`/edit-product/${product.id}`);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Evitar la navegación al hacer clic en el botón
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

                      {/* Selección de cantidad */}
                      <div className="quantity-selector">
                        <label htmlFor={`quantity-${product.id}`}>Cantidad:</label>
                        <input
                          type="number"
                          id={`quantity-${product.id}`}
                          value={selectedQuantity[product.id] || 1}
                          min="1"
                          max={product.stock}
                          onClick={(e) => e.stopPropagation()} // Evitar navegación al hacer clic en el input
                          onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        />
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Evitar la navegación al hacer clic en el botón
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
                              e.stopPropagation(); // Evitar la navegación al hacer clic en el botón
                              navigate(`/edit-product/${product.id}`);
                            }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Evitar la navegación al hacer clic en el botón
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
