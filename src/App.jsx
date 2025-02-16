import "./App.css";
import Restaurant from "./restaurant";
import Signup from "./Signup";
import KfcMenu from "./kfcMenu";
import PizzaHutMenu from "./pizzaHutMenu";
import McdonaldMenu from "./mcdonaldMenu";
import Login from "./login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/Restaurant" element={<Restaurant />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Mcdonald" element={<McdonaldMenu />} />
          <Route path="/PizzaHut" element={<PizzaHutMenu />} />
          <Route path="/Kfc" element={<KfcMenu />} />
          <Route path="/Login" element={<Login />} />
          <Route path="*" element={<Navigate to="/Login" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
