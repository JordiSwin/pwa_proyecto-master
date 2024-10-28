import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import UploadProd from './components/UploadProd';
import EditProduct from './components/EditProduct';
import EditProfile from './components/EditProfile'; 
import Cart from './components/Cart';
import Receipt from './components/Recibo'; // Corregido el nombre del componente
import ProductDetails from './pages/ProductDetails'; // Importar el componente de detalles de productos
import { auth, db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { CartProvider } from './CartContext';

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Verificar si el usuario es admin
        try {
          const userRef = doc(db, 'usuarios', currentUser.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists() && docSnap.data().role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Error al verificar el rol del usuario:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <CartProvider>
      <Router>
        <Navbar user={user} isAdmin={isAdmin} />
        <Routes>
          {/* La ruta de inicio es pública */}
          <Route path="/" element={<Home />} />

          {/* Las rutas públicas como login y registro */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" replace />} />
          <Route path="/recibo" element={user ? <Receipt /> : <Navigate to="/login" replace />} />
          <Route path="/upload-product" element={isAdmin ? <UploadProd /> : <Navigate to="/" replace />} />
          <Route path="/edit-product/:productId" element={isAdmin ? <EditProduct /> : <Navigate to="/" replace />} />
          <Route path="/productos/:productId" element={<ProductDetails />} /> {/* Agregar la ruta para detalles de productos */}
          <Route path="/product-details/:productId" element={<ProductDetails />} />
          <Route path="/edit-profile" element={user ? <EditProfile /> : <Navigate to="/login" replace />} /> {/* Ruta de editar perfil */}
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
