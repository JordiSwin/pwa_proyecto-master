import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import '../styles/EditProfile.css'; // Asumiendo que vas a agregar estilos personalizados

function EditProfile() {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
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
        const userRef = doc(db, 'usuarios', currentUser.uid);
        await updateDoc(userRef, {
          fullName,
          address,
        });

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

        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
}

export default EditProfile;
