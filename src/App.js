import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Cart from './components/Cart'; // Importa la página del carrito
import { auth } from './firebaseConfig';
import { CartProvider } from './CartContext';
import UploadProducto from './components/UploadProd';
import Recibo from './components/Recibo';


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
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} /> {/* Ruta para el carrito */}
          <Route path="/upload" element={<UploadProducto />} /> {/* Ruta para el carrito */}
          <Route path="/recibo" element={<Recibo />} /> {/* Ruta para el carrito */}

        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
