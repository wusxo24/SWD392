import { HiChartBarSquare } from "react-icons/hi2";
import { FaUserDoctor } from "react-icons/fa6";
import { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { logout, resetPassword } from "@/services/authService"; // Import functions
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Menu icon
import LogoutIcon from "@mui/icons-material/Logout"; // Logout icon
import LockResetIcon from "@mui/icons-material/LockReset"; // Reset Password icon
import CloseIcon from "@mui/icons-material/Close"; // Close button for modal
import Logo from "@/assets/Logo.png";
import { toast, ToastContainer } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Sidebar = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [roleName, setRoleName] = useState(null);
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setUserId(localStorage.getItem("userId") || sessionStorage.getItem("userId"));
    setUserName(localStorage.getItem("userName") || sessionStorage.getItem("userName"));
    setRoleName(localStorage.getItem("roleName") || sessionStorage.getItem("roleName"));

    // Close popup when clicking outside
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsLogoutPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        window.location.href = "/login"; // Redirect after logout
      } else {
        console.error(result.message);
        toast.error(result.message); // Optional toast. for errors
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An unexpected error occurred during logout.");
    }
  };

  const handleResetPassword = async () => {
    const token = localStorage.getItem("resetToken") || sessionStorage.getItem("resetToken");

    if (!token || !newPassword) {
      toast.error("Please enter a valid password.");
      return;
    }

    try {
      await resetPassword(token, newPassword);
      toast.success("Password reset successfully!");
      setIsResetPasswordModalOpen(false); // Close modal after success
      setNewPassword(""); // Clear input
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white border-r border-[#d1d5db]">
      {/* Logo */}
      <ToastContainer/>
      <img src={Logo} alt="Logo" className="h-[100px] w-[150px] ml-5" />

      {/* Divider Line */}
      <div className="h-[2px] bg-[#d1d5db] mx-5"></div>

      {/* Navigation Links */}
      <ul className="text-[#515151] mt-5 flex-1">
        {[
          { to: "/account", label: "Account Management", icon: <HiChartBarSquare /> },
          { to: "/doctor-management", label: "Doctor Management", icon: <FaUserDoctor /> },
        ].map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 rounded-lg cursor-pointer transition-all relative ${
                isActive ? "bg-[#f2f3ff] text-[#000] font-medium" : "text-[#515151] hover:bg-gray-100"
              }`
            }
          >
            <div
              className={`absolute left-0 h-full w-[4px] rounded-r-lg transition-all ${
                window.location.pathname === to ? "bg-[#51a2ff]" : "bg-transparent"
              }`}
            ></div>

            <div
              className="p-2 rounded-full transition-all flex items-center justify-center"
              style={{
                background: window.location.pathname === to ? "#51a2ff" : "#E5E7EB",
                width: "40px",
                height: "40px",
              }}
            >
              {icon}
            </div>
            <p>{label}</p>
          </NavLink>
        ))}
      </ul>

      {/* User Info Section (Fixed at Bottom) */}
      {userId && (
        <div className="border-t border-[#d1d5db] p-4 flex items-center justify-between relative">
          <div>
            <p className="font-semibold text-[#515151]">{userName}</p>
            <p className="text-sm text-[#808080]">{roleName}</p>
          </div>

          {/* Menu Button */}
          <button onClick={() => setIsLogoutPopupOpen(!isLogoutPopupOpen)} className="text-gray-600 cursor-pointer">
            <MoreVertIcon />
          </button>

          {/* Logout Popup */}
          {isLogoutPopupOpen && (
            <div ref={menuRef} className="absolute bottom-14 left-65 w-48 bg-white shadow-lg rounded-lg border border-gray-200">
              <button
                onClick={() => setIsResetPasswordModalOpen(true)}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <LockResetIcon className="mr-2" /> Reset Password
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <LogoutIcon className="mr-2" /> Log out
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reset Password Modal */}
      {isResetPasswordModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Reset Password</h2>
              <button onClick={() => setIsResetPasswordModalOpen(false)} className="text-gray-500 cursor-pointer">
                <CloseIcon />
              </button>
            </div>

            {/* Password Input with Toggle Visibility */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded-md pr-10"
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>

            <button
              onClick={handleResetPassword}
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600 mt-4 cursor-pointer"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

