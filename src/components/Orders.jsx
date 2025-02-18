import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const Orders = ({ userId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersList);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [userId]);

  return (
    <div>
      <h2>Your Orders</h2>
      {orders.map((order) => (
        <p key={order.id}>
          Order #{order.id} - Status: {order.status}
        </p>
      ))}
    </div>
  );
};

export default Orders;
