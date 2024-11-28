import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import UploadProd from './components/UploadProd';
import EditProduct from './components/EditProduct';
import EditProfile from './components/EditProfile'; 
import Cart from './components/Cart';
import Receipt from './components/Recibo';
import ProductDetails from './pages/ProductDetails';
import Tabla from './components/ProductTable';
import { auth, db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { CartProvider } from './CartContext';
import ProtectedRoute from './components/security/ProtectedRoute'; // Importa el componente

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, 'usuarios', currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists() && docSnap.data().role === 'admin') {
          setIsAdmin(true);
        } else {
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

          {/* Rutas protegidas para usuarios autenticados */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute user={user}>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recibo"
            element={
              <ProtectedRoute user={user}>
                <Receipt />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas para administradores */}
          <Route
            path="/upload-product"
            element={
              <ProtectedRoute user={isAdmin}>
                <UploadProd />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-product/:productId"
            element={
              <ProtectedRoute user={isAdmin}>
                <EditProduct />
              </ProtectedRoute>
            }
          />

          {/* Ruta pública para ver detalles del producto */}
          <Route path="/productos/:productId" element={<ProductDetails />} />
          <Route path="/product-details/:productId" element={<ProductDetails />} />

          {/* Ruta protegida para editar el perfil */}
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute user={user}>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          {/* Tabla visible para todos los usuarios */}
          <Route path="/Ver Productos" element={<Tabla />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
