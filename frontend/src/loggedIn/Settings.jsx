import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import Sidebar from "./Sidebar";

const Settings = () => {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
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
    registrationNumber: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${api}/dashboard`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data && response.data.data) {
          setFormData((prevData) => ({
            ...prevData,
            name: response.data.data.name || "",
            email: response.data.data.email || "",
            phone: response.data.data.phone || "",
            registrationNumber: response.data.data.registrationNumber || "",
          }));
        } else {
          setError("Failed to load settings.");
        }
      } catch (error) {
        setError(
          `${
            error.response?.data?.msg || "An error occurred."
          } Try again later.`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [api, authToken]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("registrationNumber", formData.registrationNumber);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }
    if (formData.password) {
      formDataToSend.append("password", formData.password);
    }

    try {
      const response = await axios.post(`${api}/settings`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(response.data);

      if (response.data.status === "success") {
        alert("Settings updated successfully!");
      } else {
        setError(response.data.msg || "Failed to update settings.");
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
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-grow flex flex-col justify-center items-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <h1 className="mx-auto text-center text-xl lg:text-3xl xl:text-3xl font-bold mb-6 text-gray-800">
            <span className="text-blue-500">Update </span>
            Your Settings
          </h1>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture / Logo
            </label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="block w-full mt-1 text-sm text-grey-700 file:mr-4 file:py-2 file:px-4 file:border file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 rounded"
            />
            {formData.image && typeof formData.image === "string" && (
              <img
                src={formData.image}
                alt="current profile"
                className="mt-2 h-20 w-20 rounded-full object-cover"
              />
            )}
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
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="New Password"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm New Password"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
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
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
