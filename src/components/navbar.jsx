import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout } from "@/services/authService"; // ✅ Import the logout function
import Logo from "../assets/Logo.png";
import NavLinkWithScroll from "./NavLinkWithScroll";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [token, setToken] = useState(
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
  );
  const profileRef = useRef(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfilePopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userName = localStorage.getItem("userName") || sessionStorage.getItem("userName");
  const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
  const role = localStorage.getItem("roleName") || sessionStorage.getItem("roleName");

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("authToken") || sessionStorage.getItem("authToken"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isLoginPage = ["/login", "/register", `/profile/${userId}`, "/forgot-password"].includes(
    location.pathname
  );

  const handleLogout = async () => {
    setShowLoginModal(false); // Close modal first
    const response = await logout();
    if (response.success) {
      navigate("/login");
    } else {
      console.error("Logout failed:", response.message);
    }
  };

  return (
    <div className="relative w-full h-[80px] bg-[#fffffF] flex items-center justify-between px-6 md:px-12 shadow-md z-10">
      {/* Logo */}
      <NavLink to="/Home" className="flex items-center">
        <img src={Logo} alt="Logo" className="h-[60px] w-auto" />
      </NavLink>

      {/* Navigation */}
      {role !== "Admin" && role !== "Manager" && (
        <ul className="flex space-x-6 text-gray-700 hidden md:flex">
          <NavLinkWithScroll to="hero" label="Home" />
          <NavLinkWithScroll to="about" label="About Us" />
          <NavLinkWithScroll to="pricing" label="Pricing" />
          <NavLinkWithScroll to="team" label="Our Team" />
          <NavLink to="/news" className="nav-link cursor-pointer hover:text-gray-900">
            Our News
          </NavLink>
        </ul>
      )}
      {!token && (
        <Link to="/login">
          <button className="bg-[#0DBFFF] text-white px-6 py-2 rounded-full hover:bg-[#0BB0E0] transition">
            Login
          </button>
        </Link>
      )}

      {/* Profile Section */}
      {!isLoginPage && token && (
        <div className="relative" ref={profileRef}>
          <button onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)} className="focus:outline-none">
            <i className="fas fa-user text-[#0DBFFF] text-[30px] cursor-pointer"></i>
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute right-0 mt-5 w-48 bg-white rounded-lg shadow-lg divide-y divide-gray-100
            transition-transform duration-200 ease-in-out transform ${
              isProfilePopupOpen ? "scale-100 opacity-100" : "scale-80 opacity-0 pointer-events-none"
            }`}
          >
            <div className="py-1">
              <div className="px-4 py-2 text-gray-800 text-center">Welcome, {userName}</div>
            </div>
            <div className="py-1">
              <Link to={`/userProfile/${userId}`} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <AssignmentIndIcon /> Profile
              </Link>
              <Link to={`/servicesHistory/${userId}`} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <ShoppingCartIcon /> Service History
              </Link>
              <Link to={`/userRecord/${userId}`} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <InventoryIcon /> Your Purchase
              </Link>
            </div>
            <button
              onClick={() => setShowLoginModal(true)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 my-1 cursor-pointer"
            >
              <LogoutIcon /> Log out
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Log out confirmation</h3>
            <p className="text-gray-600">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button className="py-2 px-6 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400" onClick={() => setShowLoginModal(false)}>
                Cancel
              </button>
              <button className="py-2 px-6 bg-[#0DBFFF] text-white rounded-lg hover:bg-[#0a6999]" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
