import { useState, useEffect } from "react";
import axios from "axios";
import ".././css/Restaurant.css";
import { useNavigate, Link } from "react-router-dom";
import logo from "../img/food-truck-event-logo-food-fair-logo_185190-83.jpg";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "./CartContext";
import { motion } from "framer-motion";

const Restaurant = () => {
  const [restaurants, setRestaurant] = useState([]);
  const navigate = useNavigate();
  const { cartCount } = useCart();

  useEffect(() => {
    getRestaurant();
  }, []);

  const getRestaurant = async () => {
    try {
      const result = await axios.get("http://localhost:8080/Restaurant");
      setRestaurant(result.data);
    } catch (error) {
      console.error("Error getting data:", error);
    }
  };

  const handleNavigate = (restaurantName) => {
    let path = "";
    switch (restaurantName.toLowerCase()) {
      case "mcdonald":
        path = "/Mcdonald";
        break;
      case "kentucky fried chicken":
        path = "/Kfc";
        break;
      case "pizza hut":
        path = "/PizzaHut";
        break;
      default:
        path = "/";
    }
    navigate(path);
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
      <h1>RESTAURANTS</h1>
      <div className="res-container">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-border">
            <motion.div
              className="restaurant-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ rotate: "0deg" }}
              animate={{ rotate: "360deg" }}
              transition={{ duration: 1, ease: "backInOut" }}
            >
              <img
                className="restaurant-img"
                src={restaurant.imageUrl}
                alt={restaurant.title}
                onClick={() => handleNavigate(restaurant.title)}
                style={{ cursor: "pointer" }}
              />
              <h3 className="restaurant-title">{restaurant.title}</h3>
              <p className="restaurant-description">{restaurant.description}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Restaurant;
