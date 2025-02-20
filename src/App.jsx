import "./App.css";
import Restaurant from "./components/restaurant";
import Signup from "./components/Signup";
import KfcMenu from "./components/menu/kfcMenu";
import PizzaHutMenu from "./components/menu/pizzaHutMenu";
import McdonaldMenu from "./components/menu/mcdonaldMenu";
import Login from "./components/login";
import Cart from "./components/cart";
import Orders from "./components/Orders";
import { CartProvider } from "./components/CartContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/Restaurant" element={<Restaurant />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Mcdonald" element={<McdonaldMenu />} />
            <Route path="/PizzaHut" element={<PizzaHutMenu />} />
            <Route path="/Kfc" element={<KfcMenu />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/Order/:orderId" element={<Orders />} />
            <Route path="*" element={<Navigate to="/Login" />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </>
  );
}

export default App;
