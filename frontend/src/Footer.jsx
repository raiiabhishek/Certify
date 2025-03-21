import React from "react";
export default function Footer() {
  return (
    <footer className="bg-indigo-700 text-white py-6 ">
      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} Certify. All rights reserved.</p>
      </div>
    </footer>
  );
}
