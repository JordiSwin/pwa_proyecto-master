import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
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

  const { addToCart } = useContext(CartContext); // Contexto del carrito

  const [showFullDescription, setShowFullDescription] = useState(false); // Nuevo estado para controlar la descripción
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'productos', productId);
        const productSnapshot = await getDoc(productRef);

        if (productSnapshot.exists()) {
          const productData = productSnapshot.data();
          setProduct(productData);

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

      setComment('');
      setRating(1);
      alert('Comentario agregado con éxito');
    } catch (error) {
      console.error('Error al agregar el comentario:', error);
      alert('Hubo un error al agregar el comentario');
    }
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

    // Aquí utilizamos la lógica de agregar al carrito usando el contexto `CartContext`
    const productToAdd = {
      id: productId,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl, // Aseguramos que se mantenga la imagen
      quantity: parseInt(quantity, 10),
    };

    addToCart(productToAdd); // Usamos la función del contexto del carrito para agregar

    alert(`Has agregado ${quantity} unidad(es) de ${product.name} al carrito!`);
  };

  if (loading) {
    return <p>Cargando detalles del producto...</p>;
  }

  if (!product) {
    return <p>Producto no encontrado.</p>;
  }

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
      </div>

      <div className="product-reviews">
        <h3>Reseñas del Producto</h3>
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index} className="review">
              <p><strong>{review.user}:</strong> {review.comment}</p>
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
  );
}

export default ProductDetails;
