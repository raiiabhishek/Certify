import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import {
  FaHome,
  FaFileAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaCog,
} from "react-icons/fa";
import { MdReport } from "react-icons/md";
import { GrCertificate } from "react-icons/gr";
import { PiCertificateFill } from "react-icons/pi";

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 bg-[#2c4036] text-white p-2 rounded-md z-50"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside
        className={`bg-[#2c4036] text-white h-screen fixed top-0 left-0 flex flex-col py-8 px-4 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-64 w-full max-w-sm`}
      >
        <Link to="/home" className="text-2xl font-bold mb-8 text-center">
          Certify
        </Link>

        <nav className="flex flex-col gap-4">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `flex items-center py-2 px-4 rounded-md hover:bg-[#3e5a4a] ${
                isActive ? "bg-[#3e5a4a] font-semibold" : ""
              }`
            }
          >
            <FaHome className="mr-2" />
            Home
          </NavLink>

          <NavLink
            to="/templates"
            className={({ isActive }) =>
              `flex items-center py-2 px-4 rounded-md hover:bg-[#3e5a4a] ${
                isActive ? "bg-[#3e5a4a] font-semibold" : ""
              }`
            }
          >
            <FaFileAlt className="mr-2" />
            Templates
          </NavLink>
          <NavLink
            to="/certificates"
            className={({ isActive }) =>
              `flex items-center py-2 px-4 rounded-md hover:bg-[#3e5a4a] ${
                isActive ? "bg-[#3e5a4a] font-semibold" : ""
              }`
            }
          >
            <PiCertificateFill className="mr-2" />
            Certificates
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `flex items-center py-2 px-4 rounded-md hover:bg-[#3e5a4a] ${
                isActive ? "bg-[#3e5a4a] font-semibold" : ""
              }`
            }
          >
            <MdReport className="mr-2" />
            Reports
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center py-2 px-4 rounded-md hover:bg-[#3e5a4a] ${
                isActive ? "bg-[#3e5a4a] font-semibold" : ""
              }`
            }
          >
            <FaCog className="mr-2" />
            Settings
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 rounded px-4 py-2 font-bold hover:bg-red-600 flex items-center justify-center"
        >
          <FaSignOutAlt className="mr-2" />
          Log Out
        </button>
      </aside>
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
