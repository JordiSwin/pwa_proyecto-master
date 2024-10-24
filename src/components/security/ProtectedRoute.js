import { Navigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Firebase authentication

function ProtectedRoute({ children }) {
  if (!auth.currentUser) {
    return <Navigate to="/login" />; // Redirige a login si no está autenticado
  }

  return children; // Renderiza el componente hijo si está autenticado
}

export default ProtectedRoute;
