import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <header className="bg-[#2c4036] py-4 text-white px-5 lg:px-10 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Certify
        </Link>

        {/* Navigation Links */}
        <nav className="flex space-x-4">
          <NavLink
            to="/login"
            className="border border-white px-4 py-1 rounded-md hover:bg-white hover:text-[#2c4036] transition duration-300"
          >
            Login
          </NavLink>
          <NavLink
            to="/signup"
            className="border border-white px-4 py-1 rounded-md hover:bg-white hover:text-[#2c4036] transition duration-300"
          >
            Sign Up
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
