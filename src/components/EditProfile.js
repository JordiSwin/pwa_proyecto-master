import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateEmail, updatePassword } from 'firebase/auth';
import '../styles/EditProfile.css'; // Asumiendo que vas a agregar estilos personalizados

function EditProfile() {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const userRef = doc(db, 'usuarios', currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setFullName(userData.fullName || '');
            setAddress(userData.address || '');
            setEmail(currentUser.email || ''); // Obtener el email del usuario autenticado
          }
        } catch (error) {
          console.error('Error al obtener los datos del usuario:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        // Actualizar Firestore (nombre y dirección)
        const userRef = doc(db, 'usuarios', currentUser.uid);
        await updateDoc(userRef, {
          fullName,
          address,
        });

        // Actualizar correo electrónico (Firebase Authentication)
        if (email !== currentUser.email) {
          await updateEmail(currentUser, email);
        }

        // Actualizar contraseña (Firebase Authentication)
        if (password && password === confirmPassword) {
          await updatePassword(currentUser, password);
        } else if (password !== confirmPassword) {
          alert('Las contraseñas no coinciden');
          return;
        }

        alert('Perfil actualizado con éxito');
      } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        alert('Hubo un error al actualizar el perfil');
      }
    }
  };

  if (loading) {
    return <p>Cargando datos del perfil...</p>;
  }

  return (
    <div className="edit-profile-container">
      <h2>Editar Perfil</h2>
      <form onSubmit={handleUpdateProfile} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="fullName">Nombre Completo</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Dirección</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Nueva Contraseña (opcional)</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
}

export default EditProfile;
