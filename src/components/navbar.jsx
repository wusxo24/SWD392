import React from 'react';
import { Hero } from '../hero/hero';
export default function Navbar() {
  return (
    <div>
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex flex-1 justify-center space-x-30 text-gray-700">
          <li className="px-3 py-4 hover:text-blue-500 cursor-pointer">LOGO</li>
          <li className="px-3 py-4 hover:text-blue-500 cursor-pointer">Home</li>
          <li className="px-3 py-4 hover:text-blue-500 cursor-pointer">About Us</li>
          <li className="px-3 py-4 hover:text-blue-500 cursor-pointer">Pricing</li>
          <li className="px-3 py-4 hover:text-blue-500 cursor-pointer">Our Team</li>
          <li className="px-3 py-4 hover:text-blue-500 cursor-pointer">Our Blog</li>
          <li className="px-3 py-2 hover:text-blue-500 cursor-pointer">
            <button className="bg-[#0DBFFF] text-white px-6 py-2 rounded-full hover:bg-[#0BB0E0] transition">
          Login</button></li>          
        </ul>    
      </div>
    </nav>
    <Hero/>
    </div>
  );
}
