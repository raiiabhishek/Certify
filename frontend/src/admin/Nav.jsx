import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
export default function Nav() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <header className="bg-indigo-700 py-4 text-white px-5 lg:px-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Certify
        </Link>
        <nav className="space-x-4">
          <NavLink
            to="/admin/home"
            className="hover:underline underline-offset-8"
          >
            Home
          </NavLink>
          <NavLink
            to="/admin/users"
            className="hover:underline underline-offset-8"
          >
            Users
          </NavLink>
          <NavLink
            to="/admin/certificates"
            className="hover:underline underline-offset-8"
          >
            Certificates
          </NavLink>
          <NavLink
            to="/admin/reports"
            className="hover:underline underline-offset-8"
          >
            Reports
          </NavLink>
          <button
            onClick={handleLogout}
            className="bg-red-500 rounded px-5 py-2 font-bold hover:bg-red-600"
          >
            Log Out{" "}
          </button>
        </nav>
      </div>
    </header>
  );
}
