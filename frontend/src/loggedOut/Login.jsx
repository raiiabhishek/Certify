import React, { useState, useContext } from "react";
import axios from "axios";
import Nav from "../Nav.jsx";
import Footer from "../Footer.jsx";
import { AuthContext } from "../../AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Cert from "../assets/cert.png";

export default function Login() {
  const api = import.meta.env.VITE_URL;
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState();
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api}/login`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.status === "success") {
        login(response.data.token, response.data.role, response.data.id);
        navigate(response.data.role === "admin" ? "/admin/home" : "/home");
      }
    } catch (error) {
      setError(` ${error.response?.data?.msg || "error occurred"} `);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-200">
      <Nav />

      <div className="grid grid-cols-1 md:grid-cols-2 items-center flex-grow px-4 xl:pb-10">
        {/* Left Image */}
        <div className="hidden md:flex justify-center">
          <img src={Cert} alt="Login Illustration" className="max-w-md" />
        </div>

        {/* Right Form */}
        <div className="w-full">
          <section className="py-8 pb-0 px-4 text-center">
            <h1 className="text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold">
              <span className="text-[#2c4036]">Welcome</span> Back!
            </h1>
          </section>

          <form
            onSubmit={handleSubmit}
            className="w-11/12 md:w-2/3 lg:w-1/2 mx-auto bg-white rounded-lg shadow-md p-6 mt-6"
          >
            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="border border-gray-300 text-sm rounded-md focus:ring-[#2c4036] focus:border-[#2c4036] w-full p-2.5"
                placeholder="john.doe@company.com"
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="border border-gray-300 text-sm rounded-md focus:ring-[#2c4036] focus:border-[#2c4036] w-full p-2.5"
                  placeholder="•••••••••"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="text-right mt-3">
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#2c4036] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Error */}
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#2c4036] hover:bg-[#1f3027] text-white font-semibold py-2.5 rounded-md transition duration-300"
            >
              Log In
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6 mb-10 px-4">
            <p className="text-gray-600">
              Don&apos;t have an account?
              <br />
              <Link
                to="/signup"
                className="text-[#2c4036] font-medium inline-flex items-center hover:underline"
              >
                Sign Up Now
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 14 10"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
