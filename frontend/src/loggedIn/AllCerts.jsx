import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import { AuthContext } from "../../AuthContext";
import axios from "axios";
import Sidebar from "./Sidebar";

export default function AllCerts() {
  const api = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${api}/dashboard`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUser(response.data.data);
        setLoading(false);
      } catch (e) {
        setError("Failed to load user data.");
        setLoading(false);
      }
    };
    if (authToken) {
      fetchProfile();
    }
  }, [authToken, api]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg">
        Error: {error}
      </div>
    );
  }

  function numberToText(inputString) {
    const numberMapping = {
      0: "abc",
      1: "def",
      2: "ghi",
      3: "jkl",
      4: "mno",
      5: "pqr",
      6: "stu",
      7: "vwx",
      8: "yza",
      9: "bcd",
    };

    return [...inputString].map((char) => numberMapping[char] || char).join("");
  }

  const handleViewCertificate = (certificateId) => {
    const enc = numberToText(certificateId);
    navigate(`${enc}`);
  };

  const handleRevokeCertificate = async (certificateId) => {
    if (window.confirm("Are you sure you want to revoke this certificate?")) {
      try {
        await axios.delete(`${api}/certificate/revoke/${certificateId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const updatedCertificates = user.certificates.filter(
          (cert) => cert._id !== certificateId
        );
        setUser({ ...user, certificates: updatedCertificates });
        alert("Certificate revoked successfully!");
      } catch (e) {
        console.error("Failed to revoke certificate:", e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            <span className="text-[#2c4036]">Total Certificates</span>
          </h1>

          {user?.certificates && user.certificates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
              {user.certificates.map((certificate) => (
                <div
                  key={certificate._id}
                  className="bg-white shadow-md border border-gray-200 rounded-lg p-5 hover:shadow-lg transition"
                >
                  <h2 className="text-lg font-semibold text-gray-800 break-words mb-2 ">
                    Certificate ID:{" "}
                    <span className="text-[#346f73]">{certificate._id}</span>
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Created on:{" "}
                    {new Date(certificate.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() =>
                        handleViewCertificate(certificate.certificateUrl)
                      }
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-[#346f73] border border-[#346f73] rounded hover:bg-[#346f73] hover:text-white transition cursor-pointer"
                    >
                      <AiOutlineEye className="mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleRevokeCertificate(certificate._id)}
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition cursor-pointer"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-8">
              No certificates found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
