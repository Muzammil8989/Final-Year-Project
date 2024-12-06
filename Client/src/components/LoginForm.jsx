import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate instead of useHistory

  const handleLogin = async () => {
    try {
      console.log({ email, password, role });

      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
        role,
      });

      const { token, roleAssigned } = response.data;

      localStorage.setItem("token", token);

      if (roleAssigned) {
        // Handle role assignment logic if needed
      }

      // Redirect to user profile page
      navigate("/profile"); // Use navigate instead of history.push
    } catch (error) {
      console.error("Login error:", error);
      // Handle login error
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;
