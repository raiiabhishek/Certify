import React, { useState, useEffect } from "react";
import Nav from "../Nav";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const api = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    image: null,
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    registrationNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRoleChange = async (e) => {
    handleInputChange(e);
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("registrationNumber", formData.registrationNumber);
    formDataToSend.append("image", formData.image);

    try {
      const response = await axios.post(`${api}/signup`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response);
      if (response.data.status === "success") {
        navigate("/login");
      }
    } catch (error) {
      setError(
        `${error.response?.data?.msg || "An error occurred."} Try again later.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      {" "}
      {/* Updated Container */}
      <Nav />
      <div className="flex justify-center items-center flex-grow">
        {" "}
        {/* Updated Container */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md space-y-4 mx-auto"
        >
          <h1 className="mx-auto text-center text-xl lg:text-3xl xl:text-3xl font-bold mb-6 text-gray-800">
            <span className="text-blue-500">Register </span>
            Your Account
          </h1>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture / Logo
            </label>
            <input
              type="file"
              name="image"
              required
              onChange={handleFileChange}
              className="block w-full mt-1 text-sm text-grey-700 file:mr-4 file:py-2 file:px-4 file:border file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 rounded"
            />
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="John Doe"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                required
                placeholder="45678"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="example@gmail.com"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="e.g. +9779800000000"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              required
              className="h-4 w-4 text-blue-500 border rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-blue-500 underline">
                terms and conditions
              </a>
            </label>
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded-md bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Register"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
