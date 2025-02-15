import { useState, useEffect } from "react";
import axios from "axios";
import "./css/mcdonald.css";

const McdonaldMenu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMenu();
  }, []);

  const getMenu = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8080/menu/a4e544a2-76a1-4e50-984a-0c7a09eedfa4"
      );
      console.log("✅ Mcdonald Menu received:", result.data);

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
      <h1>Mcdonald Menu</h1>
      {loading ? (
        <p>Loading menu...</p>
      ) : (
        <div className="container">
          {menu.length > 0 ? (
            menu.map((dish) => (
              <div key={dish.id} className="mcdonald-border">
                <img src={dish.img_url} className="mcdonald-img" />
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

export default McdonaldMenu;
