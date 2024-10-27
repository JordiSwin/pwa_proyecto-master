import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Cart from './components/Cart'; // Importa la página del carrito
import { auth } from './firebaseConfig';
import { CartProvider } from './CartContext';
import UploadProducto from './components/UploadProd';
import Recibo from './components/Recibo';
import EditarProducto from './components/EditProd';
import TablaProductos from './components/ProductTable';
import DetallesProducto from './components/ProductDetail';
import ProtectedRoute from './components/security/ProtectedRoute'; // Importa el componente de rutas protegidas

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Escuchar los cambios en el estado de autenticación
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <CartProvider>
      <Router>
        <Navbar /> {/* Componente de navegación */}
        <Routes>
          {/* La ruta de inicio es pública */}
          <Route path="/" element={<Home />} />

          {/* Las rutas públicas como login y registro */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas con alerta */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute user={user}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute user={user}>
                <UploadProducto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recibo"
            element={
              <ProtectedRoute user={user}>
                <Recibo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editarproducto/:productId"
            element={
              <ProtectedRoute user={user}>
                <EditarProducto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tablaproductos"
            element={
              <ProtectedRoute user={user}>
                <TablaProductos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:productId"
            element={
              <ProtectedRoute user={user}>
                <DetallesProducto />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
