import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../Nav";
import Footer from "../Footer";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    const api = import.meta.env.VITE_URL;
    e.preventDefault();
    console.log(newPassword);
    console.log(confirmPassword);
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setMessage("");
      return;
    }

    try {
      const response = await axios.post(`${api}/reset-password/${token}`, {
        newPassword,
      });
      setMessage(response.data.msg);
      setError("");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "An error occurred.");
      setMessage("");
    }
  };

  return (
    <div>
      <Nav />
      <div className="xl:px-20 lg:px-10 px-5 lg:space-y-14 space-y-8 mt-12">
        <h1 className="text-xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-bold text-center">
          Reset Password
        </h1>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-white p-6 rounded-lg space-y-4 mx-auto "
        >
          {message && <p>{message}</p>}
          {error && <p className="text-red">{error}</p>}
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="border p-2 rounded block w-full"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="border p-2 rounded block w-full"
          />
          <button
            type="submit"
            className="mt-4 bg-green-700 text-white py-2 px-4 rounded block w-full hover:bg-blue-700"
          >
            Reset Password
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
