import { useState, useEffect } from "react";
import axios from "axios";
import "./css/Restaurant.css";
import { useNavigate } from "react-router-dom";

const Restaurant = () => {
  const [restaurants, setRestaurant] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getRestaurant();
  }, []);

  const getRestaurant = async () => {
    try {
      const result = await axios.get("http://localhost:8080/Restaurant");
      console.log("Restaurant data received:", result.data);
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
    <div>
      <h1>RESTAURANTS</h1>
      <div className="container">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-border">
            <img
              className="restaurant-img"
              src={restaurant.imageUrl}
              alt={restaurant.title}
              onClick={() => handleNavigate(restaurant.title)}
              style={{ cursor: "pointer" }}
            />
            <h3 className="restaurant-title">{restaurant.title}</h3>
            <p className="restaurant-description">{restaurant.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurant;
