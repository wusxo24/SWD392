import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './login/login';
import Register from './login/register';
import { Hero } from './hero/hero';
import { AboutUs } from './hero/aboutUs';
import { Pricing } from './hero/pricing';
import ScrollToTop from './components/ScrollToTop';
import { OurBest } from './hero/ourBest';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="App">
      <AuthProvider>
      <BrowserRouter>
        {/* Navbar is now outside Routes, so it will show on all pages */}
        <Navbar />
        <ScrollToTop/>
        <Routes>
          <Route path="/" element={<><Hero /> <OurBest/> <AboutUs/> <Pricing/></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
