import React, { useState } from "react";
import axios from "axios";
import Nav from "../Nav";
import Footer from "../Footer";

const ForgotPassword = () => {
  const api = import.meta.env.VITE_URL;
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${api}/forgot-password`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(response.data.msg);
      setError("");
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
          <span className="text-red">Oops</span>! You forgot your password
        </h1>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-white p-6 rounded-lg space-y-4 mx-auto "
        >
          {message && <p>{message}</p>}
          {error && <p className="text-red">{error}</p>}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2 rounded block w-full"
          />
          <button
            type="submit"
            className="mt-4 bg-blue-700 text-white py-2 px-4 rounded block w-full hover:bg-green-700"
          >
            Send Reset Email
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
