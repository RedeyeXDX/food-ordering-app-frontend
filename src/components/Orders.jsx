import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../css/order.css";
import { useCart } from "./CartContext";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { cartCount, removeFromAllCart } = useCart();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const userId = decoded.id;

    const q = query(
      collection(db, "Orders"),
      where("userId", "==", userId),
      where("status", "!=", "Completed")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersList);
    });

    return () => unsubscribe();
  }, []);

  const completeOrder = async (orderId) => {
    try {
      const orderRef = doc(db, "Orders", orderId);
      await updateDoc(orderRef, { status: "Completed" });
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      await axios.delete(`http://localhost:8080/cart/clear/${userId}`, {
        headers: { Authorization: `Bearer ${token.trim()}` },
      });
      removeFromAllCart();
      navigate("/Restaurant");
    } catch (error) {
      console.error("❌ Error completing order:", error);
    }
  };

  return (
    <>
      <div className="order-container">
        {orders.map((order) => (
          <div key={order.id} className="order-wrapper">
            <div className="order-tracking">
              <h2>Live Order Tracking</h2>
              <div className="progress-container">
                <div
                  className={`progress-bar ${
                    order.status === "Pending"
                      ? "width-33"
                      : order.status === "On the Way"
                      ? "width-66"
                      : "width-100"
                  }`}
                ></div>
                <div className="progress-steps">
                  <span
                    className={order.status !== "Pending" ? "completed" : ""}
                  >
                    Order Received
                  </span>
                  <span
                    className={order.status === "Completed" ? "completed" : ""}
                  >
                    On the Way
                  </span>
                  <span
                    className={order.status === "Completed" ? "completed" : ""}
                  >
                    Delivered
                  </span>
                </div>
              </div>
              <div
                className={`step ${order.status === "Pending" ? "active" : ""}`}
              >
                <div className="icon">🕒</div>
                <div className="details">
                  <h4>Order Received</h4>
                  <p>{order.createdAt?.toDate().toLocaleString()}</p>
                </div>
              </div>

              <div
                className={`step ${
                  order.status === "On the Way" ? "active" : ""
                }`}
              >
                <div className="icon">📍</div>
                <div className="details">
                  <h4>On the Way</h4>
                  <p>Estimated delivery in 30 mins</p>
                </div>
              </div>

              <div
                className={`step ${
                  order.status === "Completed" ? "active" : ""
                }`}
              >
                <div className="icon">✅</div>
                <div className="details">
                  <h4>Delivered</h4>
                  <p>Enjoy your meal! 🍔</p>
                  {order.status !== "Completed" && (
                    <button
                      className="confirm-btn"
                      onClick={() => completeOrder(order.id)}
                    >
                      Confirm Delivery
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="order-details">
              <h2>Order Details</h2>
              <h3>Order ID: {order.id}</h3>
              <p>Status: {order.status}</p>
              {order.items.map((item, index) => (
                <div key={index} className="item-card">
                  <p>
                    {item.name} - Qty: {item.quantity}
                  </p>
                  <img
                    src={item.dish?.img_url}
                    alt={item.dish?.food_name}
                    width="100"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Orders;
