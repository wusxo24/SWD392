import React from "react";
import HomeIcon from "@/assets/icons/home.icon";
import AccountIcon from "@/assets/icons/account.icon";
import SupportIcon from "@/assets/icons/support.icon";

const NavBar = () => {
  return (
    <div className="absolute bottom-5 flex w-full items-center px-5">
      <div className="flex justify-between w-full bg-white rounded-full px-10 pt-3 pb-1">
        <button title="Home" className="flex flex-col items-center">
          <HomeIcon />
          <div>Home</div>
        </button>
        <button title="Support" className="flex flex-col items-center">
          <div className="absolute bottom-4 p-4 bg-white rounded-full">
            <div className="bg-[#239AC6] rounded-full p-2">
              <SupportIcon />
            </div>
          </div>
          <div className="pt-6 z-10">Support</div>
        </button>
        <button title="Account" className="flex flex-col items-center">
          <AccountIcon />
          <div>Account</div>
        </button>
      </div>
    </div>
  );
};

export default NavBar;
