import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await signup(email, password);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to create an account");
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            id="email"
            type="email"
            required
            className="signup-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            id="password"
            type="password"
            required
            className="signup-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="signup-button">
            Create Account
          </button>
        </form>
        <p className="login-text">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
