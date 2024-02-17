// AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userProfile, setUserProfile] = useState(null);

  const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
    fetchProfile(token);
  };

  const storedToken = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setToken(null);
    setUserProfile(null);
  };

  const fetchProfile = async (token) => {
    try {
      const res = await axios.get('http://localhost:3000/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUserProfile(res.data);
      localStorage.setItem('admin',res.data.admin)
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const storedAdminDetail=localStorage.getItem('admin')

  return (
    <AuthContext.Provider value={{ token, login, logout, userProfile,storedToken,storedAdminDetail}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
