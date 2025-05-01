import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <header className="bg-[#2c4036] py-4 text-white px-5 lg:px-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Certify
        </Link>
        <nav>
          <NavLink
            to="/login"
            className="mr-4 hover:underline underline-offset-8"
          >
            Login
          </NavLink>
          <NavLink to="/signup" className="hover:underline underline-offset-8">
            Sign Up
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
