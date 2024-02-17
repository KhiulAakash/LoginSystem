import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../../pages/AuthContext/AuthContext.";
import { FiMenu } from "react-icons/fi";

export default function Header() {
  const { logout, token } = useAuth();
  const navigate = useNavigate();
  const [active,setActive]=useState(false);

  const handleLogout = () => {
    logout();
    return navigate("/login");
  };

  return (
    <header>
      <div className="logo">
        <Link to="/">
          <h1>Logo</h1>
        </Link>
      </div>
      <nav id="menu">
      <FiMenu className="menuIcon" onClick={()=>{setActive(!active);console.log(active)}}/>
      </nav>
      <div className="desktopNav">
        <ul>
          <li>
            <NavLink to="/" extra="true">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
          <li>
            <NavLink to="/service">Services</NavLink>
          </li>
          <li>
            <NavLink to="/profile">Profile</NavLink>
          </li>
          <li>
            {token ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <div className="loginSignupBtns">
                <button>
                  <Link to="/login">Login</Link>
                </button>
                <button>
                  <Link to="/register">Signup</Link>
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
      <nav className={`mobileNav ${active?'active':''}`}>
        <ul>
          <li>
            <Link to="/" extra="true">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/service">Services</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          {token ? (
            <li>
              <button id="logout" onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
