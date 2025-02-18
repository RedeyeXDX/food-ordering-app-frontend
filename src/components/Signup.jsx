import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ".././css/signin.css";
import logo from "../img/food-truck-event-logo-food-fair-logo_185190-83.jpg";

const Signup = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/auth/register", user);
      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <>
      <div>
        <img src={logo} className="logo" />
      </div>
      <div className="container">
        <h1 className="header">Signup</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="input"
        />
        <button type="submit" onClick={handleSubmit} className="submit">
          Signup
        </button>
        <p className="passage">
          Already have an account? <a href="/Login">Login</a>
        </p>
      </div>
    </>
  );
};

export default Signup;
