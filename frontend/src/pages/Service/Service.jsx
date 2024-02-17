import React, { useEffect, useState } from "react";
import "./Service.css";
import axios from "axios";
import design from "../../assets/design.png";
import "./Service.css";

export default function Service() {
  const [serviceData, setServiceData] = useState([]);

  useEffect(() => {
    fetchServiceData();
  }, []);
  const fetchServiceData = async () => {
    try {
      const resp = await axios.get("http://localhost:3000/service");
      if (resp.statusText) {
        setServiceData(resp.data.response);
      }
    } catch (error) {
      console.error("Failed to fetch service data:", error);
    }
  };

  return (
    <main id="service">
      <div className="section">
        {serviceData.map((eachServiceData, index) => (
          <div key={index} className="card">
            <div className="image">
              <img src={design} alt="Design" />
            </div>
            <div className="content">
              <div className="pp">
                <p>{eachServiceData.provider}</p>
                <p>{eachServiceData.price}</p>
              </div>
              <h2>{eachServiceData.service}</h2>
              <p>{eachServiceData.description}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
