import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CreditCardIcon from "@mui/icons-material/CreditCard"; // MUI icon
import { HiClipboardDocumentList, HiChatBubbleLeftEllipsis, HiMiniHeart } from "react-icons/hi2";
import Logo from "@/assets/Logo.png";

const Sidebar = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [roleName, setRoleName] = useState(null);

  useEffect(() => {
    setUserId(localStorage.getItem("userId") || sessionStorage.getItem("userId"));
    setUserName(localStorage.getItem("userName") || sessionStorage.getItem("userName"));
    setRoleName(localStorage.getItem("roleName") || sessionStorage.getItem("roleName"));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white border-r border-[#d1d5db]">
      {/* Logo */}
      <img src={Logo} alt="Logo" className="h-[100px] w-[150px] ml-5" />

      {/* Divider Line */}
      <div className="h-[2px] bg-[#d1d5db] mx-5"></div>

      {/* Navigation Links */}
      <ul className="text-[#515151] mt-5 flex-1">
        {[
          { to: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
          { to: "/subscription", label: "Subscription", icon: <CreditCardIcon /> },
          { to: "/doctor-list", label: "Doctor List", icon: <HiClipboardDocumentList /> },
          { to: "/member-request", label: "Member Request", icon: <HiChatBubbleLeftEllipsis /> },
          { to: "/rating-feedback", label: "Rating and Feedback", icon: <HiMiniHeart /> },
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
            {/* Left Node Indicator */}
            <div
              className={`absolute left-0 h-full w-[4px] rounded-r-lg transition-all ${
                window.location.pathname === to ? "bg-[#51a2ff]" : "bg-transparent"
              }`}
            ></div>

            {/* Icon with Background */}
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
        <div className="border-t border-[#d1d5db] p-4 text-center">
          <p className="font-semibold text-[#515151]">{userName}</p>
          <p className="text-sm text-[#808080]">{roleName}</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
