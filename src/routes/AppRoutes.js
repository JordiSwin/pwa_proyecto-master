import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import { auth } from './firebaseConfig'; // Para autenticación

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Ruta protegida: Redirige a login si no está autenticado */}
        <Route
          path="/cart"
          element={
            auth.currentUser ? <Cart /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
