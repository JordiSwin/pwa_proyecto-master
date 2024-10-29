import React, { createContext, useEffect, useState } from 'react';
import { db, auth } from './firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userCartRef = doc(db, 'usuarios', currentUser.uid);
        const userCartSnap = await getDoc(userCartRef);
        if (userCartSnap.exists()) {
          setCart(userCartSnap.data().cart || []);
        } else {
          await setDoc(userCartRef, { cart: [] });
        }
      } else {
        setCart([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const addToCart = async (product) => {
    if (!user) return;
    const userCartRef = doc(db, 'usuarios', user.uid);
    const newCart = [...cart, product];
    setCart(newCart);
    try {
      await updateDoc(userCartRef, { cart: arrayUnion(product) });
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    const userCartRef = doc(db, 'usuarios', user.uid);
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    try {
      const productToRemove = cart.find(item => item.id === productId);
      await updateDoc(userCartRef, { cart: arrayRemove(productToRemove) });
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    const userCartRef = doc(db, 'usuarios', user.uid);
    setCart([]);
    try {
      await setDoc(userCartRef, { cart: [] }, { merge: true });
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
