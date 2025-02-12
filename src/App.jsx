import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './login/login';
import Register from './login/register';
import { Hero } from './hero/hero';
import { AboutUs } from './hero/aboutUs';
import { Pricing } from './hero/pricing';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* Navbar is now outside Routes, so it will show on all pages */}
        <Navbar />

        <Routes>
          <Route path="/" element={<><Hero /> <AboutUs/> <Pricing/></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
