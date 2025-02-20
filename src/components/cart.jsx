import { useState, useEffect } from "react";
import axios from "axios";
import ".././css/cart.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import logo from "../img/food-truck-event-logo-food-fair-logo_185190-83.jpg";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "./CartContext";
import { db, collection, addDoc, serverTimestamp } from "../firebase";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { cartCount, removeFromCart, removeFromAllCart } = useCart();

  useEffect(() => {
    getCartItems();
  }, []);

  const getCartItems = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found.");
        navigate("/Login");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        console.log("Token expired. Redirecting to login...");
        localStorage.removeItem("token");
        navigate("/Login");
        return;
      }

      const response = await axios.get(`http://localhost:8080/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems([...response.data]);
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (dishId, quantity) => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      if (quantity === 0) {
        removeItem(dishId);
        getCartItems();
        return;
      }

      const response = await axios.put(
        "http://localhost:8080/cart/update",
        { dish_id: dishId, user_id: userId, quantity },
        { headers: { Authorization: `Bearer ${token.trim()}` } }
      );

      getCartItems();
    } catch (error) {
      console.error("❌ Error updating quantity:", error);
    }
  };

  const removeItem = async (dishId) => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      await axios.delete("http://localhost:8080/cart/remove", {
        data: { dish_id: dishId, user_id: userId },
        headers: { Authorization: `Bearer ${token.trim()}` },
      });
      removeFromCart(dishId);
      getCartItems();
    } catch (error) {
      console.error("❌ Error removing item:", error);
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      await axios.delete(`http://localhost:8080/cart/clear/${userId}`, {
        data: { user_id: userId },
        headers: { Authorization: `Bearer ${token.trim()}` },
      });
      removeFromAllCart();
      getCartItems();
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
    }
  };

  const checkout = async () => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      if (!cartItems.length) {
        console.error("Cart is empty!");
        return;
      }

      // Create a new order in Firestore
      const orderRef = await addDoc(collection(db, "Orders"), {
        userId: userId,
        status: "Pending", // Default status
        items: cartItems.map((item) => ({
          name: item.dish.food_name,
          quantity: item.quantity,
          dish: {
            img_url: item.dish.img_url,
            food_name: item.dish.food_name,
          },
        })),
        createdAt: new Date(),
      });
      removeFromAllCart();
      navigate(`/Order/${orderRef.id}`);
    } catch (error) {
      console.error("❌ Error placing order:", error);
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/Restaurant">
          <img src={logo} alt="logo" className="logo-res" />
        </Link>
        <Link to="/Cart">
          <FaShoppingCart className="cart" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
      </nav>
      <div className="cart-container">
        <h1>Your Cart</h1>

        {loading ? (
          <p>Loading cart...</p>
        ) : cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.dish.img_url}
                    alt={item.dish.food_name}
                    className="cart-img"
                  />
                  <div className="cart-details">
                    <h3>{item.dish.food_name}</h3>
                    <div className="cart-actions">
                      <button
                        onClick={() =>
                          updateQuantity(item.dish.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.dish.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.dish.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={clearCart} className="clear-cart-btn">
              Clear Cart
            </button>
            <button onClick={checkout} className="checkout-btn">
              Checkout
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
