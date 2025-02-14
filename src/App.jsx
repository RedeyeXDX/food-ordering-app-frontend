import "./App.css";
import Restaurant from "./restaurant";
import SignIn from "./SignIn";
import KfcMenu from "./kfcMenu";
import PizzaHutMenu from "./pizzaHutMenu";
import McdonaldMenu from "./mcdonaldMenu";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/Restaurant" element={<Restaurant />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="*" element={<Navigate to="/Restaurant" />} />
          <Route path="/Mcdonald" element={<McdonaldMenu />} />
          <Route path="/PizzaHut" element={<PizzaHutMenu />} />
          <Route path="/Kfc" element={<KfcMenu />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
