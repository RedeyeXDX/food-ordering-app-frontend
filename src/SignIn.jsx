import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const { loginWithRedirect, user, isAuthenticated, logout } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user) {
        console.log("User data before sending:", user);
        sendUserData(user);
      }
    }
  }, [isAuthenticated, user]);

  const sendUserData = async (user) => {
    try {
      const response = await axios.post(
        "https://b33d-175-156-130-173.ngrok-free.app/register",
        user
      );

      navigate("/Airbnb");
    } catch (error) {
      console.error("Error sending user data:", error);
    }
  };

  return (
    <>
      <h1>Sign in</h1>
      <button onClick={() => loginWithRedirect()}>Log In</button>
      <button onClick={() => logout()}>Logout</button>
    </>
  );
};

export default SignIn;
