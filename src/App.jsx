import React from 'react';
import {Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './login/login';
import Register from './login/register';
import { Hero } from './page/hero';
import { AboutUs } from './page/aboutUs';
import { Pricing } from './page/pricing';
import ScrollToTop from './components/ScrollToTop';
import { OurBest } from './page/ourBest';
import { Footer } from './components/footer';
import { OurTeam } from './page/ourTeam';

function App() {
  const location = useLocation();  
  const hideNavFooter = location.pathname === "/login" || location.pathname === "/register";
  return (
    <div className="App">
        {/* Navbar is now outside Routes, so it will show on all pages */}
        {!hideNavFooter && <Navbar />}  
        <ScrollToTop/>
        <Routes>
          <Route path="/" element={<><Hero /> <OurBest/> <AboutUs/> <OurTeam/> <Pricing/></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        {!hideNavFooter && <Footer />}
    </div>
  );
}

export default App;
