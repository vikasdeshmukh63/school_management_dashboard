import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between p-4">
      {/* search bar  */}
      <div className="hidden lg:flex items-center justify-between gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" width={14} height={14} alt="search.png" />
        <input placeholder="search..." className="w-[200px] p-2 bg-transparent outline-none" />
      </div>
      {/* icon and user  */}
      <div className="flex items-center gap-6 justify-end w-full">
        {/* message  */}
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-between cursor-pointer">
          <Image src="/message.png" width={20} height={20} alt="message.png" />
        </div>
        {/* announcement  */}
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-between cursor-pointer relative">
          <Image src="/announcement.png" width={20} height={20} alt="announcement.png" />
          {/* badge  */}
          <div className="absolute -top-3 -right-3 w-5 h-5 flex justify-center items-center bg-purple-500 text-white rounded-full text-xs">1</div>
        </div>
        {/* user name and role  */}
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">John Doe</span>
          <span className="text-[10px] text-gray-500 text-right">Admin</span>
        </div>

        <Image src="/avatar.png" width={36} height={36} alt="User" className="rounded-full" />
      </div>
    </div>
  );
};

export default Navbar;
