import { useState, useEffect } from "react";
import axios from "axios";
import ".././css/Restaurant.css";
import { useNavigate, Link } from "react-router-dom";
import logo from "../img/food-truck-event-logo-food-fair-logo_185190-83.jpg";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "./CartContext";
import { motion, AnimatePresence } from "framer-motion";
import video1 from "../video/20250220_2117_Welcome to McDonald's_simple_compose_01jmhr31exfj2vc734t7jnnnb3.mp4";
import video2 from "../video/20250220_2130_KFC Family Feast_simple_compose_01jmhrthkrf6jtrmhwqz6sbj2z.mp4";
import video3 from "../video/20250220_2136_Slicing Pizza Deliciously_simple_compose_01jmhs5dwwfdkvnttfz2xcgh95.mp4";
import video4 from "../video/20250220_2152_Delicious Pizza Delight_simple_compose_01jmht2f3te72ajn20rmwfqsnv.mp4";

const Restaurant = () => {
  const [restaurants, setRestaurant] = useState([]);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videos = [video1, video2, video3, video4];

  useEffect(() => {
    getRestaurant();
  }, []);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
  };

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
      <div className="video-slideshow">
        <AnimatePresence mode="wait">
          <motion.video
            key={currentVideoIndex}
            width="100%"
            height="auto"
            controls
            autoPlay
            onEnded={handleVideoEnd}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <source src={videos[currentVideoIndex]} type="video/mp4" />
          </motion.video>
        </AnimatePresence>
      </div>
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
