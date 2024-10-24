import React, { createContext, useState } from 'react';

// Crear el contexto del carrito
export const CartContext = createContext();

// Proveedor del contexto del carrito
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Función para agregar productos al carrito
  const addToCart = (product) => {
    // Verificar si el producto ya está en el carrito
    const existingProduct = cart.find((item) => item.name === product.name);

    if (existingProduct) {
      // Incrementar la cantidad si ya existe
      setCart(
        cart.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Agregar el producto al carrito si no existe
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Función para remover productos del carrito
  const removeFromCart = (productName) => {
    setCart(cart.filter((item) => item.name !== productName));
  };

  // Función para vaciar el carrito
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
