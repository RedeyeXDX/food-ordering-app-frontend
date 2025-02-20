import { useState, useEffect } from "react";
import axios from "axios";
import "../../css/mcdonald.css";
import logo from "../../img/food-truck-event-logo-food-fair-logo_185190-83.jpg";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useCart } from "../CartContext";
import { motion, useAnimation } from "framer-motion";

const McdonaldMenu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { cartCount, addToCart, removeFromAllCart } = useCart();
  const cartControls = useAnimation();

  useEffect(() => {
    getMenu();
    getUserId();
  }, []);

  const getMenu = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8080/menu/a4e544a2-76a1-4e50-984a-0c7a09eedfa4"
      );
      setMenu(result.data[0]?.Dishes || []);
    } catch (error) {
      console.error("❌ Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserId = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found. Redirecting to login...");
      navigate("/Login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        console.log("Token expired. Redirecting to login...");
        localStorage.removeItem("token");
        removeFromAllCart();
        navigate("/Login");
        return;
      }
      setUserId(decoded.id);
    } catch (error) {
      console.error("Error decoding token:", error);
      removeFromAllCart();
      navigate("/Login");
    }
  };

  const handleAddtoCart = async (dishId) => {
    if (!userId) {
      console.error("No user ID found. User must be logged in.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/cart/add",
        {
          user_id: userId,
          dish_id: dishId,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token.trim()}` },
        }
      );
      addToCart(dishId);
      await cartControls.start({
        rotate: [0, -20, 20, -10, 10, 0],
        transition: { duration: 0.6 },
      });
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/Restaurant">
          <img src={logo} alt="logo" className="logo-res" />
        </Link>
        <Link to="/Cart">
          <motion.div animate={cartControls} whileTap={{ scale: 0.9 }}>
            <FaShoppingCart className="cart" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </motion.div>
        </Link>
      </nav>
      <h1>Mcdonald Menu</h1>
      {loading ? (
        <p>Loading menu...</p>
      ) : (
        <div className="mc-container">
          {menu.length > 0 ? (
            menu.map((dish) => (
              <div key={dish.id} className="mcdonald-border">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <img src={dish.img_url} className="mcdonald-img" />
                  <h3>{dish.food_name}</h3>
                  <button onClick={() => handleAddtoCart(dish.id)}>
                    Add to Cart
                  </button>
                </motion.div>
              </div>
            ))
          ) : (
            <p>No menu items available.</p>
          )}
        </div>
      )}
    </>
  );
};

export default McdonaldMenu;
