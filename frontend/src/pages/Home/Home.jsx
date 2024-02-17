import React from "react";
import "./Home.css";
import homeImage from '../../assets/home.png'
import { Link } from "react-router-dom";

export default function Home() {
  return (
      <main>
        <section>
          <div className="content">
            <p>We are the World Best IT Company</p>
            <h1>Welcome to Khiul Technical</h1>
            <p>
              Are you ready to take your business to the next level with
              cutting-edge IT solutions? Look no further! At Thapa Technical, we
              specialize in providing innovative IT services and solutions
              tailored to meet your unique needs.
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
            <img src={homeImage} alt="Home Image" />
          </div>
        </section>
      </main>
  );
}