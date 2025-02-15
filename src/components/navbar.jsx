import React from 'react';
import { Hero } from '../hero/hero';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png'
import NavLinkWithScroll from './NavLinkWithScroll';
export default function Navbar() {
  return (
    <div>
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex flex-1 justify-center space-x-30 text-gray-700">
          <li className="px-3 hover:text-blue-500 cursor-pointer">
            <img src={Logo} style={{height:"60px",width:"auto"}}>
            </img></li>
          <NavLinkWithScroll to="hero" label="Home" />
          <NavLinkWithScroll to="about" label="About Us" />
          <NavLinkWithScroll to="pricing" label="Pricing" />
          <NavLinkWithScroll to="team" label="Our Team" />
          <NavLinkWithScroll to="blog" label="Our Blog" />
          <li className="px-3 py-2 hover:text-blue-500 cursor-pointer">
            <Link to={'/login'}><button className="bg-[#0DBFFF] text-white px-6 py-2 rounded-full hover:bg-[#0BB0E0] transition cursor-pointer" >
            Login</button></Link></li>          
        </ul>    
      </div>
    </nav>
    </div>
  );
}
