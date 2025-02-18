import { createContext, useState, useContext } from "react";

// Create Cart Context
const CartContext = createContext();

// Custom Hook for easy usage
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  // Function to add item to cart
  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
    setCartCount(cartCount + 1);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item.id !== itemId);

      // Ensure cart count doesn't go below zero
      setCartCount((prevCount) => Math.max(prevCount - 1, 0));

      return updatedCart; // ✅ This ensures cartItems updates properly
    });
  };

  // Function to clear the cart
  const removeFromAllCart = () => {
    setCartCount(0);
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        cartItems,
        addToCart,
        removeFromCart,
        removeFromAllCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
