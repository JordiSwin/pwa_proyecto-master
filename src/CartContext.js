import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      const q = query(
        collection(db, 'carts'),
        where('userId', '==', auth.currentUser.uid)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userCart = snapshot.docs.map((doc) => doc.data());
        setCart(userCart);
      });
      return () => unsubscribe();
    }
  }, [auth.currentUser]);

  const addToCart = async (product) => {
    if (auth.currentUser) {
      try {
        await addDoc(collection(db, 'carts'), {
          ...product,
          userId: auth.currentUser.uid,
        });
        alert('Producto agregado al carrito');
      } catch (error) {
        console.error('Error al agregar al carrito:', error);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
