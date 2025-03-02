import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext"; // Import Auth Context
import Logo from "../assets/Logo.png";
import NavLinkWithScroll from "./NavLinkWithScroll";
import { FaUserCircle } from "react-icons/fa"; // Import Account Icon
import { Menu, MenuButton, MenuItems } from "@headlessui/react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex flex-1 justify-center space-x-30 text-gray-700">
          <li className="px-3 hover:text-blue-500 cursor-pointer">
            <img
              src={Logo}
              alt="Logo"
              style={{ height: "60px", width: "auto" }}
            />
          </li>
          <NavLinkWithScroll to="hero" label="Home" />
          <NavLinkWithScroll to="about" label="About Us" />
          <NavLinkWithScroll to="pricing" label="Pricing" />
          <NavLinkWithScroll to="team" label="Our Team" />
          <NavLinkWithScroll to="blog" label="Our Blog" />
          <Link className="pt-2" to={"/login"}>
            <button className="bg-[#0DBFFF] text-white px-6 py-2  rounded-full hover:bg-[#0BB0E0] transition cursor-pointer">
              Login
            </button>
          </Link>
        </ul>
      </div>
    </nav>
  );
}
