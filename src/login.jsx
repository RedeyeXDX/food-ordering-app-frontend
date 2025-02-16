import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../img/food-truck-event-logo-food-fair-logo_185190-83.jpg";
import "./css/signin.css";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/auth/login", user);
      localStorage.setItem("token", res.data.token); // Store JWT
      alert("Login successful!");
      navigate("/Restaurant");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <>
      <div className="img-div">
        <img src={logo} className="logo" />
      </div>
      <div className="container">
        <h1 className="header">Login</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
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
          Login
        </button>
        <p>
          Don't have an account? <a href="/Signup">Signup</a>
        </p>
      </div>
    </>
  );
};

export default Login;
