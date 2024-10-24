import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import UploadProd from './components/UploadProd';
import ProtectedRoute from './components/security/ProtectedRoute'; // Ruta protegida
import { auth } from './firebaseConfig';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Ruta protegida para subir productos */}
        <Route 
          path="/uploadprod" 
          element={
            <ProtectedRoute>
              <UploadProd />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta protegida para el carrito */}
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
