<<<<<<< Updated upstream
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import { CartContext } from '../CartContext'; // Usamos el contexto del carrito
import '../styles/ProductDetails.css';

import { updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';


function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(1);
  const [averageRating, setAverageRating] = useState(0);
  const [quantity, setQuantity] = useState(1); // Estado para la cantidad
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [bestSellers, setBestSellers] = useState([]); // Mover aquí el estado
=======
  import React, { useState, useEffect, useContext } from 'react';
  import { useParams } from 'react-router-dom';
  import { auth, db } from '../firebaseConfig';
  import { doc, getDoc } from 'firebase/firestore';
  import { CartContext } from '../CartContext'; // Usamos el contexto del carrito
  import '../styles/ProductDetails.css';
  import { updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'; // Asegúrate de importar estas funciones


  function ProductDetails() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(1);
    const [averageRating, setAverageRating] = useState(0);
    const [quantity, setQuantity] = useState(1); // Estado para la cantidad
    const [isAdmin, setIsAdmin] = useState(false);
>>>>>>> Stashed changes

    const { addToCart } = useContext(CartContext); // Contexto del carrito

<<<<<<< Updated upstream
  const [showFullDescription, setShowFullDescription] = useState(false); // Nuevo estado para controlar la descripción
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal


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


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'productos', productId);
        const productSnapshot = await getDoc(productRef);
=======
    useEffect(() => {
      const fetchProduct = async () => {
        try {
          const productRef = doc(db, 'productos', productId);
          const productSnapshot = await getDoc(productRef);
>>>>>>> Stashed changes

          if (productSnapshot.exists()) {
            const productData = productSnapshot.data();
            const productWithId = { ...productData, id: productSnapshot.id };
            setProduct(productWithId);

            // Calcular el promedio de calificaciones si hay reseñas
            if (productData.reviews && productData.reviews.length > 0) {
              const totalRating = productData.reviews.reduce((sum, review) => sum + review.rating, 0);
              const avgRating = totalRating / productData.reviews.length;
              setAverageRating(avgRating.toFixed(1)); // Redondear a un decimal
            }
          } else {
            console.error('Producto no encontrado');
          }
        } catch (error) {
          console.error('Error al obtener el producto:', error);
        } finally {
          setLoading(false);
        }
<<<<<<< Updated upstream
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    const checkAdmin = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, 'usuarios', currentUser.uid);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists() && userSnapshot.data().role === 'admin') {
          setIsAdmin(true);
        }
      }
    };

    checkAdmin();
  }, [productId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    const currentUser = auth.currentUser;
  
    if (!currentUser) {
      alert('Debes iniciar sesión para agregar un comentario');
      return;
    }
  
    if (!comment) {
      alert('Por favor, escribe un comentario');
      return;
    }
  
    try {
      const userRef = doc(db, 'usuarios', currentUser.uid);
      const userSnapshot = await getDoc(userRef);
      const userName = userSnapshot.exists() ? userSnapshot.data().fullName : 'Usuario';
  
      const productRef = doc(db, 'productos', productId);
      const newReview = {
        user: userName,
        comment,
        rating: parseInt(rating, 10),
      };
  
      // Actualizamos en Firebase
      await updateDoc(productRef, {
        reviews: arrayUnion(newReview),
      });
  
      // Actualizamos el estado de "product" con los nuevos comentarios
      setProduct((prevProduct) => {
        const updatedReviews = [...(prevProduct.reviews || []), newReview];
        const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalRating / updatedReviews.length;
  
        setAverageRating(avgRating.toFixed(1));
  
        return {
          ...prevProduct,
          reviews: updatedReviews,
        };
      });
  
      // Verificar que el estado esté actualizado
      console.log("Comentarios actualizados:", product.reviews);
  
      setComment('');
      setRating(1);
      alert('Comentario agregado con éxito');
    } catch (error) {
      console.error('Error al agregar el comentario:', error);
      alert('Hubo un error al agregar el comentario');
    }
  };
=======
      };

      fetchProduct();

      const checkAdmin = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userRef = doc(db, 'usuarios', currentUser.uid);
          const userSnapshot = await getDoc(userRef);
          if (userSnapshot.exists() && userSnapshot.data().role === 'admin') {
            setIsAdmin(true);
          }
        }
      };

      checkAdmin();
    }, [productId]);

    const handleCommentSubmit = async (e) => {
      e.preventDefault();

      const currentUser = auth.currentUser;

      if (!currentUser) {
        alert('Debes iniciar sesión para agregar un comentario');
        return;
      }

      if (!comment) {
        alert('Por favor, escribe un comentario');
        return;
      }

      try {
        const userRef = doc(db, 'usuarios', currentUser.uid);
        const userSnapshot = await getDoc(userRef);
        const userName = userSnapshot.exists() ? userSnapshot.data().fullName : 'Usuario';

        const productRef = doc(db, 'productos', productId);
        const newReview = {
          user: userName,
          comment,
          rating: parseInt(rating, 10),
        };

        await updateDoc(productRef, {
          reviews: arrayUnion(newReview),
        });
>>>>>>> Stashed changes

        setProduct((prevProduct) => {
          const updatedReviews = [...(prevProduct.reviews || []), newReview];
          const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = totalRating / updatedReviews.length;

          setAverageRating(avgRating.toFixed(1)); // Redondear a un decimal

          return {
            ...prevProduct,
            reviews: updatedReviews,
          };
        });

<<<<<<< Updated upstream
        setAverageRating(avgRating.toFixed(1));

        return {
          ...prevProduct,
          reviews: updatedReviews,
        };
      });

      alert('Comentario eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el comentario: ', error);
      alert('Hubo un error al eliminar el comentario');
    }
  };

  const handleAddToCart = () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    if (quantity < 1 || quantity > product.stock) {
      alert('Cantidad no válida');
      return;
    }

    // Aquí utilizamos la lógica de agregar al carrito usando el contexto `CartContext`
    const productToAdd = {
      id: productId,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl, // Aseguramos que se mantenga la imagen
      quantity: parseInt(quantity, 10),
=======
        setComment('');
        setRating(1);
        alert('Comentario agregado con éxito');
      } catch (error) {
        console.error('Error al agregar el comentario:', error);
        alert('Hubo un error al agregar el comentario');
      }
>>>>>>> Stashed changes
    };

    const handleDeleteComment = async (review) => {
      const productRef = doc(db, 'productos', productId);

      try {
        await updateDoc(productRef, {
          reviews: arrayRemove(review),
        });

        setProduct((prevProduct) => {
          const updatedReviews = prevProduct.reviews.filter((r) => r !== review);
          const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = updatedReviews.length > 0 ? totalRating / updatedReviews.length : 0;

          setAverageRating(avgRating.toFixed(1));

<<<<<<< Updated upstream
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="product-details-container">
      <div className="product-main">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
          onClick={openModal} // Abrir el modal al hacer clic
          style={{ cursor: 'pointer' }} // Cambiar el cursor para indicar que es clickeable
        />
        <div className="product-info">
          <h2>{product.name}</h2>
          
          {/* Mostrar descripción parcial o completa */}
          <p className="product-description">
            {showFullDescription ? product.description : `${product.description.substring(0, 100)}... `}
            <span className="toggle-description" onClick={toggleDescription}>
              {showFullDescription ? 'Mostrar menos' : 'Leer más'}
            </span>
          </p>

          <p className="product-price">Precio: ${product.price}</p>
          <p className="product-stock">Stock: {product.stock}</p>
          <div className="average-rating">
            <h3>Calificación Promedio: {averageRating} ⭐</h3>
          </div>

          {/* Sección para agregar al carrito */}
          <div className="add-to-cart">
            <label htmlFor="quantity">Cantidad:</label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              max={product.stock}
            />
            <button onClick={handleAddToCart}>Agregar al Carrito</button>
          </div>
        </div>
      </div>

      {/* Modal para mostrar la imagen ampliada */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content">
            <span className="close-modal" onClick={closeModal}>&times;</span>
            <img src={product.imageUrl} alt={product.name} className="modal-image" />
          </div>
        </div>
      )}

      <div className="add-review">
        <h3>Agregar Comentario y Calificación</h3>
        <form onSubmit={handleCommentSubmit} className="review-form">
          <textarea
            placeholder="Escribe tu comentario..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <label htmlFor="rating">Calificación:</label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <button type="submit">Enviar Comentario</button>
        </form>
        <div className="reviews-section">
  <h3>Comentarios</h3>
  {product.reviews && product.reviews.length > 0 ? (
    <ul>
      {product.reviews.map((review, index) => (
        <li key={index}>
          <strong>{review.user}</strong> (Calificación: {review.rating} ⭐)
          <p>{review.comment}</p>
          {isAdmin && (
            <button onClick={() => handleDeleteComment(review)}>Eliminar</button>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <p>No hay comentarios aún.</p>
  )}
</div>
      </div>




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
    </div>
  );
}
=======
          return {
            ...prevProduct,
            reviews: updatedReviews,
          };
        });

        alert('Comentario eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar el comentario:', error);
        alert('Hubo un error al eliminar el comentario');
      }
    };

    const handleAddToCart = () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        alert('Debes iniciar sesión para agregar productos al carrito');
        return;
      }

      if (quantity < 1 || quantity > product.stock) {
        alert('Cantidad no válida');
        return;
      }
      if (!auth.currentUser) {
        //navigate('/login');
      } else if (quantity > product.stock) {
        alert(`No hay suficiente stock para ${product.name}`);
      } else {
        console.log(productId);
        setProduct(prevProduct => ({
          ...prevProduct,
          id: productId
        }));
      // product.push(productId);
        console.log(product);
        console.log(quantity);
        addToCart({ ...product, quantity });
        alert(`Se agregó ${quantity} unidad(es) de ${product.name} al carrito`);
      }

    };

    if (loading) {
      return <p>Cargando detalles del producto...</p>;
    }

    if (!product) {
      return <p>Producto no encontrado.</p>;
    }

    return (
      <div className="product-details-container">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="product-description">{product.description}</p>
          <p className="product-price">Precio: ${product.price}</p>
          <p className="product-stock">Stock: {product.stock}</p>

          {/* Mostrar el promedio de calificaciones */}
          <div className="average-rating">
            <h3>Calificación Promedio: {averageRating} ⭐</h3>
          </div>

          {/* Sección para seleccionar la cantidad */}
          <div className="add-to-cart">
            <label htmlFor="quantity">Cantidad:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              min="1"
              max={product.stock}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <button onClick={handleAddToCart}>Agregar al Carrito</button>
          </div>

          {/* Sección para agregar comentarios y calificaciones */}
          <div className="add-review">
            <h3>Agregar Comentario y Calificación</h3>
            <form onSubmit={handleCommentSubmit} className="review-form">
              <textarea
                placeholder="Escribe tu comentario..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <label htmlFor="rating">Calificación:</label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} ⭐
                  </option>
                ))}
              </select>
              <button type="submit">Agregar Comentario</button>
            </form>
          </div>

          {/* Sección para mostrar comentarios y calificaciones */}
          <div className="product-reviews">
            <h3>Calificaciones y Comentarios</h3>
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <p><strong>{review.user}</strong>: {review.comment}</p>
                  <p>Calificación: {review.rating} ⭐</p>
                  {isAdmin && (
                    <button
                      className="delete-comment-btn"
                      onClick={() => handleDeleteComment(review)}
                    >
                      Eliminar Comentario
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No hay comentarios para este producto.</p>
            )}
          </div>
        </div>
      </div>
    );
  }
>>>>>>> Stashed changes

  export default ProductDetails;
