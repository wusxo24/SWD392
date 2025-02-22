// import { useContext } from "react";
// import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import {
  HiChartBarSquare,
  HiCalendar,
  HiMiniDocumentArrowUp,
  HiClipboardDocumentList,
} from "react-icons/hi2";

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
          to="/admin-dashboard"
        >
          <HiChartBarSquare className="text-xl" />
          <p>Dashboard</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
              isActive ? "bg-[#f2f3ff] border-r-4 border-blue-400" : ""
            }`
          }
          to={"/all-appointments"}
        >
          <HiCalendar className="text-xl" />
          <p>Appointments</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
              isActive ? "bg-[#f2f3ff] border-r-4 border-blue-400" : ""
            }`
          }
          to={"/add-doctor"}
        >
          <HiMiniDocumentArrowUp className="text-xl" />
          <p>Add Doctor</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
              isActive ? "bg-[#f2f3ff] border-r-4 border-blue-400" : ""
            }`
          }
          to={"/doctor-list"}
        >
          <HiClipboardDocumentList className="text-xl" />
          <p>Doctor List</p>
        </NavLink>
      </ul>
      {/* )} */}
    </div>
  );
};

export default Sidebar;
