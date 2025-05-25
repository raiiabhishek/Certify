import React, { useContext } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import {
  FaHome,
  FaUsers,
  FaCertificate,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="bg-[#2c4036] text-white w-64 min-h-screen py-4 px-3 flex flex-col">
      <Link
        to="/admin/home"
        className="text-xl font-bold mb-6 block text-center"
      >
        Certify
      </Link>

      <nav className="flex-grow">
        <ul>
          <li className="mb-2">
            <NavLink
              to="/admin/home"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              <FaHome className="mr-2" />
              Home
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              <FaUsers className="mr-2" />
              Users
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/admin/certificates"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              <FaCertificate className="mr-2" />
              Certificates
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/admin/reports"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              <FaChartBar className="mr-2" />
              Reports
            </NavLink>
          </li>
        </ul>
      </nav>

      <button
        onClick={handleLogout}
        className="bg-red-500 rounded px-4 py-2 font-bold hover:bg-red-600 mt-4 block w-full text-left flex items-center"
      >
        <FaSignOutAlt className="mr-2" />
        Log Out
      </button>
    </aside>
  );
}
