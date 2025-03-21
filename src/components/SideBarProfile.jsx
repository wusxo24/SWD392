import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StrollerIcon from '@mui/icons-material/Stroller';
import { Link } from 'react-router-dom';
import {Footer} from './footer';
export const SideBarProfile = () => {
  return (
    <div className="p-4 w-64 h-screen">
      {/* User Section */}
      <div className=" p-2">
      <Link to="/userProfile/:id">
        <button className="text-lg cursor-pointer px-4 py-2 w-full text-left rounded hover:bg-gray-100">
        <AccountCircleIcon/> User
        </button>
        </Link>
      </div>

      {/* Children Section */}
      <div className="p-2">
      <Link to="/childrenProfile">
        <button className="text-lg cursor-pointer px-4 py-2 w-full text-left rounded hover:bg-gray-100">
        <StrollerIcon/> Children
        </button>
      </Link>
      </div>
    </div>
  );
};
