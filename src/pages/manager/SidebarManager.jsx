// import { useContext } from "react";
// import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { HiChartPie } from "react-icons/hi2";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";
import { HiCreditCard } from "react-icons/hi2";
import { HiMiniHeart } from "react-icons/hi2";

const Sidebar = () => {
  return (
    <div className="min-h-screen bg-white border-r">
      {/* {aToken && ( */}
      <ul className="text-[#515151] mt-5">
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
              isActive ? "bg-[#f2f3ff] border-r-4 border-blue-400" : ""
            }`
          }
          to="/dashboard"
        >
          <HiChartPie className="text-xl" />
          <p>Dashboard</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
              isActive ? "bg-[#f2f3ff] border-r-4 border-blue-400" : ""
            }`
          }
          to="/subscription"
        >
          <HiCreditCard className="text-xl" />
          <p>Subscription</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
              isActive ? "bg-[#f2f3ff] border-r-4 border-blue-400" : ""
            }`
          }
          to="/doctor-list"
        >
          <HiClipboardDocumentList className="text-xl" />
          <p>Doctor List</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
              isActive ? "bg-[#f2f3ff] border-r-4 border-blue-400" : ""
            }`
          }
          to="/member-request"
        >
          <HiChatBubbleLeftEllipsis className="text-xl" />
          <p>Member Request</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
              isActive ? "bg-[#f2f3ff] border-r-4 border-blue-400" : ""
            }`
          }
          to="/rating-feedback"
        >
          <HiMiniHeart className="text-xl" />
          <p>Rating and Feedback</p>
        </NavLink>
      </ul>
      {/* )} */}
    </div>
  );
};

export default Sidebar;
