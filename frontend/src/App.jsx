import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Header from "./components/Header/Header";
import EditUser from "./pages/Admin/EditUser";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import About from "./pages/About/About";
import Service from "./pages/Service/Service";
import AdminUser from "./pages/Admin/AdminUser";
import Contact from "./pages/Contact/Contact";
import Error from "./pages/Error/Error";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/service" element={<Service/>}/>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminUser />} />
          <Route path="/edit/:id" element={<EditUser />} />
          <Route path="*" element={<Error />} />
          
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  );
}

export default App;
