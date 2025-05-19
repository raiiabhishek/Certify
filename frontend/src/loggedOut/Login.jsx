import React, { useState, useContext } from "react";
import axios from "axios";
import Nav from "../Nav.jsx";
import Footer from "../Footer.jsx";
import { AuthContext } from "../../AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Cert from "../assets/cert.jpg";
export default function Login() {
  const api = import.meta.env.VITE_URL;
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can now use formData values
    console.log("Form Submitted:", formData);
    try {
      console.log(api);
      const response = await axios.post(`${api}/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      if (response.data.status === "success") {
        login(response.data.token, response.data.role, response.data.id);
        if (response.data.role === "admin") {
          navigate("/admin/home");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      console.log(error);
      setError(` ${error.response?.data?.msg || "error occured"} `);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Nav />
      <div className="grid grid-cols-1 md:grid-cols-2 place-items-center flex-grow xl:pb-6">
        <div className="hidden md:block">
          <img src={Cert} alt="Login Image" className="max-w-md" />
        </div>

        <div className="w-full">
          {" "}
          {/* Container for the form and text */}
          <section className="bg-white">
            <div className="py-8 pb-0 px-4 mx-auto max-w-screen-xl text-center">
              <h1 className="text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-center">
                <span className="text-blue">Welcome</span> Back!
              </h1>
            </div>
          </section>
          <form
            onSubmit={handleSubmit}
            className="w-2/3 md:w-1/2 py-10 mx-auto"
          >
            {" "}
            {/* Centered form */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium t"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="border text-sm rounded-lg focus:ring-blue focus:border-blue block w-full p-2.5"
                placeholder="john.doe@company.com"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium "
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="border text-sm rounded-lg focus:ring-blue focus:border-blue block w-full p-2.5"
                  placeholder="•••••••••"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="w-full text-right mt-5">
                <Link to="/forgot-password" className="text-blue text-sm">
                  Forgot Password?
                </Link>
              </div>
              {error && <span className=" text-red">{error}</span>}
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-dark focus:ring-2 focus:outline-none focus:ring-blue font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center "
            >
              Log In
            </button>
          </form>
          <span className="px-4 text-center mb-10">
            <p className="text-gray-500 dark:text-gray-400">
              Don't have an account?
              <br />
              <Link
                to="/signup"
                className="text-blue inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Sign Up Now
                <svg
                  className="w-4 h-4 ms-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
              </Link>
            </p>
          </span>
        </div>
      </div>
      <Footer />
    </div>
  );
}
