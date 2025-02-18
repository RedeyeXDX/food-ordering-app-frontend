import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const placeOrder = async (userId, cartItems) => {
  try {
    const orderRef = collection(db, "orders");
    await addDoc(orderRef, {
      userId,
      status: "Pending",
      items: cartItems,
      createdAt: serverTimestamp(),
    });
    console.log("✅ Order placed successfully!");
  } catch (error) {
    console.error("❌ Error placing order:", error);
  }
};

export { placeOrder };
