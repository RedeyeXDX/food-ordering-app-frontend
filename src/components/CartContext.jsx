import { createContext, useState, useContext, useEffect } from "react";

// Create Cart Context
const CartContext = createContext();

// Custom Hook for easy usage
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(
    () => parseInt(localStorage.getItem("cartCount")) || 0
  );
  const [cartItems, setCartItems] = useState([]);

  // 🔥 Save cartCount to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartCount", cartCount);
  }, [cartCount]);

  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
    setCartCount((prevCount) => prevCount + 1);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item.id !== itemId);
      setCartCount((prevCount) => Math.max(prevCount - 1, 0));
      return updatedCart;
    });
  };

  const removeFromAllCart = () => {
    setCartCount(0);
    setCartItems([]);
    localStorage.removeItem("cartCount"); // 🔥 Clear from localStorage too
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
