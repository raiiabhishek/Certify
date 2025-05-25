import React from "react";
import Nav from "../Nav";
import Footer from "../Footer";
import { Link } from "react-router";

function LandingPage() {
  return (
    <div className="font-sans bg-white text-black">
      {/* Header */}
      <Nav />

      {/* Hero Section */}
      <section className="relative bg-[#d0dbe4] text-black h-[95vh] flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-4xl lg:text-6xl font-light tracking-widest mb-4 uppercase">
          Issue & Verify Certificates Securely
        </h1>
        <p className="max-w-xl text-sm lg:text-base mb-6">
          Revolutionize your credentialing process with a tamper-proof system.
          Eliminate fraud and enhance trust using blockchain technology.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="border border-black text-black hover:bg-[#2c4036] hover:text-white py-2 px-6 transition"
          >
            Get Started!
          </Link>
          <a
            href="#features"
            className="border border-black text-black hover:bg-[#2c4036] hover:text-white py-2 px-6 transition"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-50 bg-[#eaefef] flex flex-col justify-center items-center text-center px-6 ">
        <h2 className="text-7xl font-semibold mb-4">Who We Are</h2>
        <p className="max-w-xl mx-auto mb-4 text-sm">
          We help institutions issue tamper-proof, verifiable blockchain
          certificates. Our goal is to ensure credibility, security, and global
          accessibility of credentials.
        </p>
        <a href="#features" className="text-sm underline">
          Read our story &gt;
        </a>
      </section>

      {/* Features Section */}
      <section id="features" className="py-50 bg-[#d0dbe4] text-center">
        <h2 className="text-4xl font-semibold mb-10">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto">
          {[
            {
              title: "Tamper-Proof Certificates",
              text: "Each certificate is secured on the blockchain, making it virtually impossible to forge.",
            },
            {
              title: "Instant Verification",
              text: "Verify certificates instantly using their unique blockchain ID.",
            },
            {
              title: "Customizable & Beautiful Designs",
              text: "Create visually stunning certificates with multiple themes and custom images.",
            },
          ].map(({ title, text }, i) => (
            <div key={i} className="p-6 border rounded hover:shadow transition">
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-50 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Ready to Embrace Secure Certification?
        </h2>
        <p className="mb-6 text-sm">
          Start issuing and verifying blockchain certificates with ease.
        </p>
        <Link to="/login">
          <button className="border border-black px-8 py-2 hover:bg-[#2c4036] hover:text-white transition">
            Get Started Now
          </button>
        </Link>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-16 bg-[#d0dbe4] text-center">
        <h2 className="text-2xl font-semibold mb-10">Why Choose Our System?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 max-w-5xl mx-auto">
          {[
            {
              title: "Unparalleled Security",
              text: "Leverage blockchain for tamper-proof certificates. Your credentials are safe and verifiable.",
            },
            {
              title: "Efficiency and Automation",
              text: "Automate the certification process, saving time and resources.",
            },
            {
              title: "Global Verifiability",
              text: "Certificates issued with our system can be verified anywhere through the blockchain.",
            },
            {
              title: "Cost-Effective Solution",
              text: "Reduce overhead and eliminate costs associated with traditional paper certificates.",
            },
          ].map(({ title, text }, i) => (
            <div key={i} className="p-6 border rounded hover:shadow transition">
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
