import React from "react";
import "./About.css";
import aboutImage from "../../assets/about.png";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext.";

export default function About() {
  const {userProfile}=useAuth();
  return (
      <main>
        <section>
          <div className="content">
          {userProfile && <p>Welcome, {userProfile.fullName}</p>}
            <h1>Why Choose US?</h1>
            <p>
              Expertise: Our team consists of experienced IT professionals who
              are passionate about staying up-to-date with the latest industry
              trends.
            </p>
            <p>
              Customization: We understand that every business is unique. That's
              why we create solutions that are tailored to your specific needs
              and goals.
            </p>
            <p>
              Customer-Centric Approach: We prioritize your satisfaction and
              provide top-notch support to address your IT concerns.
            </p>
            <p>
              Affordability: We offer competitive pricing without compromising
              on the quality of our services.
            </p>
            <p>
              Reliability: Count on us to be there when you need us. We're
              committed to ensuring your IT environment is reliable and
              available 24/7.
            </p>
            <div className="buttons">
              <Link to="/contact">
                <button className="btnConnect">Connect Now</button>
              </Link>
              <Link to="/service">
                <button className="btnLearn">Learn More</button>
              </Link>
            </div>
          </div>
          <div className="image">
            <img src={aboutImage} alt="About Image" />
          </div>
        </section>
      </main>
  );
}