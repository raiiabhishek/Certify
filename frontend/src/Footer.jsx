import React from "react";
import logo from "./assets/logo.png";
export default function Footer() {
  return (
    <footer className="bg-[#2c4036] text-white py-10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-sm">
          {/* Contact Section */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h3 className="font-semibold mb-2">Contact Us</h3>
            <p>
              Email:{" "}
              <a href="mailto:support@certify.com" className="underline">
                support@certify.com
              </a>
            </p>
          </div>

          {/* Center Copyright */}
          <div className="mb-6 md:mb-0 text-center">
            <p>© {new Date().getFullYear()} Certify. All rights reserved.</p>
          </div>

          {/* Logo Section */}
          <div className="text-center md:text-right">
            <img
              src={logo}
              alt="Certify Logo"
              className="h-10 mx-auto md:mx-0"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
