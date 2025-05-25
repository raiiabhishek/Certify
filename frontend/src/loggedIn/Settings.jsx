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
  const [isEditing, setIsEditing] = useState(false);
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

        if (response.data?.data) {
          setFormData((prev) => ({
            ...prev,
            name: response.data.data.name || "",
            email: response.data.data.email || "",
            phone: response.data.data.phone || "",
            registrationNumber: response.data.data.registrationNumber || "",
            image: response.data.data.image || null,
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
    if (formData.image && typeof formData.image !== "string")
      formDataToSend.append("image", formData.image);
    if (formData.password) formDataToSend.append("password", formData.password);

    try {
      const response = await axios.post(`${api}/settings`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.status === "success") {
        alert("Settings updated successfully!");
        setIsEditing(false); // exit edit mode
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
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />
      <div className="flex-grow pl-64 py-10 px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            {isEditing ? "Edit Your" : "Your"}{" "}
            <span className="text-[#346f73]">Profile</span>
          </h1>

          <div className="flex justify-end mb-6">
            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              className="px-4 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Image Upload / Preview */}
            {isEditing ? (
              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Profile Picture / Logo
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
              </div>
            ) : (
              formData.image && (
                <div className="mb-4">
                  <img
                    src={formData.image}
                    alt="current"
                    className="h-20 w-20 rounded-full object-cover border"
                  />
                </div>
              )
            )}

            {/* Input Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  disabled={!isEditing}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                    isEditing
                      ? "focus:ring-2 focus:ring-blue-500"
                      : "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Registration Number */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  disabled={!isEditing}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                    isEditing
                      ? "focus:ring-2 focus:ring-blue-500"
                      : "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  disabled={!isEditing}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                    isEditing
                      ? "focus:ring-2 focus:ring-blue-500"
                      : "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  disabled={!isEditing}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                    isEditing
                      ? "focus:ring-2 focus:ring-blue-500"
                      : "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Password Fields (only in edit mode) */}
              {isEditing && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}

            {/* Submit Button */}
            {isEditing && (
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full md:w-auto px-6 py-3 rounded-md text-white font-semibold transition ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#346f73] hover:bg-[#1B3B3D]"
                  }`}
                >
                  {loading ? "Saving..." : "Save Settings"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
