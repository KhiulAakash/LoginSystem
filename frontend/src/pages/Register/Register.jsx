import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import registerImg from "../../assets/register.png";

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/register', formData);
      toast.success('Registration successful');
    } catch (error) {
      toast.error(error.response.data.errors[0])
    }
  };

  return (
    <main>
      <div className="image">
      <img src={registerImg} alt="Register Image" />
      </div>
      <div className="form">
      <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      <label htmlFor="">Full Name</label>
        <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} />
        <label>Email</label>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <label>Phone no</label>
        <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />
        <label>Password</label>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <div className="btn">
        <button type="submit">Register</button>
        </div>
      </form>
      </div>
    </main>
  );
}

export default Register;
