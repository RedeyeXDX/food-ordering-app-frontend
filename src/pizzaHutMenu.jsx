import { useState, useEffect } from "react";
import axios from "axios";
import "./css/pizzaHut.css";

const PizzaHutMenu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMenu();
  }, []);

  const getMenu = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8080/menu/f43dd393-3b7d-4936-a286-6e651e199322"
      );
      console.log("✅ Pizza hut Menu received:", result.data);

      setMenu(result.data[0]?.Dishes || []);
      console.log("this is the menu", menu);
    } catch (error) {
      console.error("❌ Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Pizza Hut Menu</h1>

      {loading ? (
        <p>Loading menu...</p>
      ) : (
        <div className="pizza-container">
          {menu.length > 0 ? (
            menu.map((dish) => (
              <div key={dish.id} className="Pizza-border">
                <img src={dish.img_url} className="Pizza-img" />
                <h3>{dish.food_name}</h3>
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

export default PizzaHutMenu;
