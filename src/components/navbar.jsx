import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // Import Auth Context
import Logo from '../assets/Logo.png';
import NavLinkWithScroll from './NavLinkWithScroll';
import { FaUserCircle } from "react-icons/fa"; // Import Account Icon
import { Menu, MenuButton, MenuItems } from '@headlessui/react';

export default function Navbar() {
  const { user, logout } = useAuth(); // Get user & logout function from Auth Context

  return (
    <nav className="bg-white shadow-md p-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex flex-1 justify-center space-x-30 text-gray-700">
          <li className="px-3 hover:text-blue-500 cursor-pointer">
            <img src={Logo} alt="Logo" style={{ height: "60px", width: "auto" }} />
          </li>
          <NavLinkWithScroll to="hero" label="Home" />
          <NavLinkWithScroll to="about" label="About Us" />
          <NavLinkWithScroll to="pricing" label="Pricing" />
          <NavLinkWithScroll to="team" label="Our Team" />
          <NavLinkWithScroll to="blog" label="Our Blog" />

          {/* User Authentication Section */}
          <li className="relative px-3 py-2 cursor-pointer">
            {user && user.username ? (
              <div className="relative">
       <Menu as="div" className="relative inline-block text-left">
                 <div>
            <MenuButton className="cursor-pointer">
                <FaUserCircle 
                  size={40} 
                  className="text-gray-700 hover:text-blue-500"
                />
            </MenuButton>
                </div>
        <MenuItems
           transition
           className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
        >
        <div className='py1'>
          <button
          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
              Profile
          </button>
        </div>
        <div className='py-1'>
        <button 
                      onClick={() => { logout();}} 
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Logout
       </button>
        </div>
        </MenuItems>
                    
        </Menu>
              </div>
            ) : (
              <Link to={'/login'}>
                <button className="bg-[#0DBFFF] text-white px-6 py-2 rounded-full hover:bg-[#0BB0E0] transition cursor-pointer">
                  Login
                </button>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
