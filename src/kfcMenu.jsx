import { useState, useEffect } from "react";
import axios from "axios";
import "./css/Kfc.css";

const KfcMenu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMenu();
  }, []);

  const getMenu = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8080/menu/83aa8354-3958-4d87-b9d6-8a095b750bd4"
      );
      console.log("KFC Menu received:", result.data);

      setMenu(result.data[0]?.Dishes || []);
      console.log("this is the menu", menu);
    } catch (error) {
      console.error(" Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <h1>KFC Menu</h1>

        {loading ? (
          <p>Loading menu...</p>
        ) : (
          <div className="kfc-container">
            {menu.length > 0 ? (
              menu.map((dish) => (
                <div key={dish.id} className="kfc-border">
                  <img src={dish.img_url} className="kfc-img" />
                  <h3>{dish.food_name}</h3>
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
