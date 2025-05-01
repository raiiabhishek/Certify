import React from "react";
export default function Footer() {
  return (
    <footer className="bg-[#2c4036] text-white py-6 ">
      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} Certify. All rights reserved.</p>
      </div>
    </footer>
  );
}
