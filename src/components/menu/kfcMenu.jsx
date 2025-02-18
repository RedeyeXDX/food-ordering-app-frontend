import { useState, useEffect } from "react";
import axios from "axios";
import "../../css/Kfc.css";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../img/food-truck-event-logo-food-fair-logo_185190-83.jpg";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../CartContext";

const KfcMenu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { cartCount, addToCart } = useCart();

  useEffect(() => {
    getMenu();
    getUserId(); // Fetch user ID from token
  }, []);

  // Fetch the menu from backend
  const getMenu = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8080/menu/83aa8354-3958-4d87-b9d6-8a095b750bd4"
      );
      setMenu(result.data[0]?.Dishes || []);
    } catch (error) {
      console.error("Error fetching menu:", error);
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
        navigate("/Login");
        return;
      }
      setUserId(decoded.id);
    } catch (error) {
      console.error("Error decoding token:", error);
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
          <FaShoppingCart className="cart" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
      </nav>
      <div>
        <h1>KFC Menu</h1>

        {loading ? (
          <p>Loading menu...</p>
        ) : (
          <div className="kfc-container">
            {menu.length > 0 ? (
              menu.map((dish) => (
                <div key={dish.id} className="kfc-border">
                  <img
                    src={dish.img_url}
                    className="kfc-img"
                    alt={dish.food_name}
                  />
                  <h3>{dish.food_name}</h3>
                  <button onClick={() => handleAddtoCart(dish.id)}>
                    Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <p>No menu items available.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default KfcMenu;
