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
        setIsEditing(false);
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
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            {isEditing ? "Edit Your" : "Your"}{" "}
            <span className="text-[#346f73]">Profile</span>
          </h1>
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-4 bg-[#346f73] rounded-full text-white text-5xl shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a9 9 0 0115 0"
                />
              </svg>
            </div>
            <div className="text-lg font-semibold text-[#346f73]"></div>
          </div>

          <div className="flex justify-end mb-6">
            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              className="px-4 py-2 rounded-md font-semibold text-white bg-[#346f73] hover:bg-[#1b3b3d] cursor-pointer"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {!isEditing ? (
            <div className="space-y-8">
              {formData.image && (
                <div className="flex justify-center mb-6">
                  <img
                    src={formData.image}
                    alt="Profile"
                    className="h-24 w-24 rounded-full border-4 border-[#346f73] object-cover shadow-lg hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <ProfileItem label="Name" value={formData.name} />
                <ProfileItem
                  label="Registration Number"
                  value={formData.registrationNumber}
                />
                <ProfileItem label="Email" value={formData.email} />
                <ProfileItem label="Phone Number" value={formData.phone} />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
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

              <div className="grid md:grid-cols-2 gap-6">
                <EditableInput
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  isEditing={isEditing}
                />
                <EditableInput
                  label="Registration Number"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  isEditing={isEditing}
                />
                <EditableInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  isEditing={isEditing}
                />
                <EditableInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  isEditing={isEditing}
                />

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
              </div>

              {error && (
                <p className="text-red-600 text-sm font-medium">{error}</p>
              )}

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
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileItem = ({ label, value }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    <p className="text-sm text-gray-500 mb-1 font-medium">{label}</p>
    <p className="text-lg font-semibold text-[#1B3B3D] break-words">{value}</p>
  </div>
);

const EditableInput = ({
  label,
  name,
  value,
  onChange,
  isEditing,
  type = "text",
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
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
);

export default Settings;
