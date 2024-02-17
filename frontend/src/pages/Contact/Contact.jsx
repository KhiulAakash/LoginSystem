import axios from "axios";
import React, { useEffect, useState } from "react";
import contactImage from "../../assets/support.png";
import "./Contact.css";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext/AuthContext.";

export default function Contact() {
  const { userProfile} = useAuth();
  const [contact, setContact] = useState({
    fullName:"",
    email: "",
    message: "",
  });
  useEffect(() => {
    if (userProfile) {
      setContact({
        fullName: userProfile.fullName || "",
        email: userProfile.email || "",
        message: "",
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post("http://localhost:3000/contact", contact);
      if (resp.status === 200) {
        toast.success("Message sent successfully");
        setContact({
          fullName: userProfile.fullName || "",
          email: userProfile.email || "",
          message: "",
        });
      }
    } catch (error) {
      console.log("Error from contact", error);
      toast.error("Failed to send message. Please try again later.");
    }
  };

  return (
    <main>
      <div className="image">
        <img src={contactImage} alt="Contact" />
      </div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <h1>Contact Us</h1>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={contact.fullName}
            onChange={handleChange}
            required
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={contact.message}
            onChange={handleChange}
            required
          />
          <div className="btn">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </main>
  );
}
