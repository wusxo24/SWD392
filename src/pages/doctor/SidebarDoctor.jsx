// import { useContext } from "react";
// import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { HiChartBarSquare } from "react-icons/hi2";
import { HiChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { HiMiniInformationCircle } from "react-icons/hi2";
import { HiStar } from "react-icons/hi2";

const Sidebar = () => {
  //   const { aToken } = useContext(AdminContext);

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
          to="/view-medical-request"
        >
          <HiChatBubbleOvalLeftEllipsis className="text-xl" />
          <p>View request</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
              isActive ? "bg-[#f2f3ff] border-r-4 border-blue-400" : ""
            }`
          }
          to="/add-info"
        >
          <HiMiniInformationCircle className="text-xl" />
          <p>Doctor profile</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
              isActive ? "bg-[#f2f3ff] border-r-4 border-blue-400" : ""
            }`
          }
          to="/analyze-report"
        >
          <HiChartBarSquare className="text-xl" />
          <p>Analyze report</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
              isActive ? "bg-[#f2f3ff] border-r-4 border-blue-400" : ""
            }`
          }
          to="/reviews"
        >
          <HiStar className="text-xl" />
          <p>Reviews</p>
        </NavLink>
      </ul>
      {/* )} */}
    </div>
  );
};

export default Sidebar;
