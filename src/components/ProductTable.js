import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/ProductTable.css';

function ProductTable() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'productos');
      const productSnapshot = await getDocs(productsCollection);
      const productsList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'productos', productId));
        setProducts(products.filter(product => product.id !== productId));
        alert('Producto eliminado correctamente');
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        alert("Hubo un error al eliminar el producto");
      }
    }
  };

  const handleEdit = (productId) => {
    navigate(`/editarproducto/${productId}`);
  };

  return (
    <div className="product-table-container">
      <h2>Lista de Productos</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <button onClick={() => handleEdit(product.id)} className="edit-btn">
                  Editar
                </button>
                <button onClick={() => handleDelete(product.id)} className="delete-btn">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
