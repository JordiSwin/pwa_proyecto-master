import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, query, orderBy, limit } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import { CartContext } from '../CartContext'; // Usamos el contexto del carrito
import '../styles/ProductDetails.css';

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
  const [bestSellers, setBestSellers] = useState([]);
  const { addToCart } = useContext(CartContext); // Contexto del carrito

  const [showFullDescription, setShowFullDescription] = useState(false); // Nuevo estado para controlar la descripción
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

  // Función para actualizar las reseñas y la calificación promedio
  const updateReviews = (reviews) => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    setAverageRating(avgRating.toFixed(1)); // Redondear a un decimal

    setProduct((prevProduct) => ({
      ...prevProduct,
      reviews: reviews,
    }));
  };

  // Obtener los productos más vendidos
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

  // Obtener los detalles del producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'productos', productId);
        const productSnapshot = await getDoc(productRef);

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
    };

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

    fetchProduct();
    checkAdmin();
  }, [productId]);

  // Manejar el envío de comentarios
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
        updateReviews(updatedReviews);
        return {
          ...prevProduct,
          reviews: updatedReviews,
        };
      });

      setComment('');
      setRating(1);
      alert('Comentario agregado con éxito');
    } catch (error) {
      console.error('Error al agregar el comentario:', error);
      alert('Hubo un error al agregar el comentario');
    }
  };

  // Manejar la eliminación de un comentario
  const handleDeleteComment = async (review) => {
    const productRef = doc(db, 'productos', productId);

    try {
      await updateDoc(productRef, {
        reviews: arrayRemove(review),
      });

      const updatedReviews = product.reviews.filter((r) => r !== review);
      updateReviews(updatedReviews);

      alert('Comentario eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      alert('Hubo un error al eliminar el comentario');
    }
  };

  // Manejar la adición de productos al carrito
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

    // Agregar al carrito utilizando el contexto
    if (!auth.currentUser) {
      // Si no está logueado, redirige a la página de login
      navigate('/login');
    } else if (quantity > product.stock) {
      alert(`No hay suficiente stock para ${product.name}`);
    } else {
      console.log(product);
      console.log(quantity);
      addToCart({ ...product, quantity });
      alert(`Se agregó ${quantity} unidad(es) de ${product.name} al carrito`);
    }
  };

  // Control de la cantidad
  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  // Funciones del modal
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
              onChange={handleQuantityChange}
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
            <img src={product.imageUrl} alt={product.name} className="modal-image" />
            <button onClick={closeModal} className="modal-close-button">Cerrar</button>
          </div>
        </div>
      )}

      {/* Comentarios */}
      <div className="reviews-section">
        <h3>Comentarios</h3>

        {/* Formularios para agregar un comentario */}
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribe tu comentario"
          ></textarea>

          <select value={rating} onChange={(e) => setRating(parseInt(e.target.value, 10))}>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} ⭐
              </option>
            ))}
          </select>
          <button type="submit">Enviar comentario</button>
        </form>

        {/* Listar los comentarios */}
        <div className="reviews-list">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review, index) => (
              <div key={index} className="review">
                <p><strong>{review.user}</strong>: {review.comment}</p>
                <p>Calificación: {review.rating} ⭐</p>
                {isAdmin && (
                  <button onClick={() => handleDeleteComment(review)}>Eliminar Comentario</button>
                )}
              </div>
            ))
          ) : (
            <p>No hay comentarios aún.</p>
          )}
        </div>
      </div>

      {/* Productos más vendidos */}
      <div className="best-sellers">
        <h3>Productos más vendidos</h3>
        <div className="best-sellers-list">
          {bestSellers.map((item) => (
            <div key={item.id} className="best-seller-item">
              <img src={item.imageUrl} alt={item.name} />
              <p>{item.name}</p>
              <p>${item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;


