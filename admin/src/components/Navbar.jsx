import React from "react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  return (
    <header className='flex py-2 px-[4%] justify-between'>
      <h1 className="text-4xl font-bold">AURA</h1>
      <button onClick={() => setToken("")}
        className='bg-gray-600 text-white px-3 py-2 sm:px-7 sm:py-1 rounded-full'
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
