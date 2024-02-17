// Login.js
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext/AuthContext.";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginImg from "../../assets/register.png";
import './Login.css'

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/login", formData);
      const { token, admin } = res.data;
      login(token);
      if (res.statusText) {
        if (admin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
        toast.success("Login Successful");
      }
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <main>
      <div className="image">
        <img src={LoginImg} alt="Login Image" />
      </div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type="text"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <div className="btn">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Login;
