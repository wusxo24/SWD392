import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Added axios import
import Logo from "../assets/Logo.png";
import NavLinkWithScroll from "./NavLinkWithScroll";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [token, setToken] = useState(
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
  );
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfilePopupOpen(false); // Close the dropdown
      }
    };

    // Add the event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => document.removeEventListener("mousedown", handleClickOutside);
  },);

  const userName = localStorage.getItem("userName") || sessionStorage.getItem("userName");
  const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(
        localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
      );
      setUserName(
        localStorage.getItem("userName") || sessionStorage.getItem("userName")
      );
      setUserId(
        localStorage.getItem("userId") || sessionStorage.getItem("userId")
      );
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isLoginPage = [
    "/login",
    "/register",
    "/profile/${userId}",
    "/forgot-password",
  ].includes(location.pathname);

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    axios
      .post("/api/auth/logout")
      .then(() => {
        ["authToken", "userId", "userName"].forEach((item) => {
          localStorage.removeItem(item);
          sessionStorage.removeItem(item);
        });
        navigate("/login");
      })
      .catch((error) => {
        console.error(
          "Logout failed:",
          error.response?.data?.message || error.message
        );
      });
  };

  return (
    <div className="relative w-full h-[80px] bg-[#fffffF] flex items-center justify-between px-6 md:px-12 shadow-md z-10">
      {/* Logo */}
      <NavLink to="/Home" className="flex items-center">
        <img src={Logo} alt="Logo" className="h-[60px] w-auto" />
      </NavLink>

      {/* Navigation */}
      <ul className="flex space-x-6 text-gray-700 hidden md:flex">
        <NavLinkWithScroll to="hero" label="Home" />
        <NavLinkWithScroll to="about" label="About Us" />
        <NavLinkWithScroll to="pricing" label="Pricing" />
        <NavLinkWithScroll to="team" label="Our Team" />
        <NavLinkWithScroll to="blog" label="Our Blog" />
      </ul>
      {!token && (
        <Link to="/login">
          <button className="bg-[#0DBFFF] text-white px-6 py-2 rounded-full hover:bg-[#0BB0E0] transition">
            Login
          </button>
        </Link>
      )}

      {/* Profile Section */}
      {!isLoginPage && token && (
        <div className="relative " ref={profileRef}>
          <button onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}>
            <i className="fas fa-user text-[#0DBFFF] text-[30px] cursor-pointer"></i>
          </button>
          {isProfilePopupOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg transition-all duration-300 ease-in-out">
              <div className="px-4 py-2 text-gray-800">Welcome, {userName}</div>

              <NavLink
                to="/profile/${userId}"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
