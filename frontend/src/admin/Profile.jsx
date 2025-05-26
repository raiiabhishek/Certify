import React, { useState, useEffect, useContext } from "react";
import { AiOutlineEye } from "react-icons/ai";
import axios from "axios";
import { useParams } from "react-router";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Nav";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope,
  FaPhone,
  FaIdBadge,
  FaChartBar,
  FaUserCircle,
} from "react-icons/fa";

const ProfilePage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("certificates");
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${api}/profile/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        setProfile(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred");
      }
    };
    fetchData();
  }, []);

  const handleTabChange = (tab) => setActiveTab(tab);

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
    if (!window.confirm("Are you sure you want to revoke this certificate?"))
      return;
    try {
      await axios.delete(`${api}/certificate/revoke/${certificateId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const response = await axios.get(`${api}/profile/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      setProfile(response.data.data);
      alert("Certificate revoked successfully!");
    } catch (e) {
      alert("Failed to revoke certificate.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="col-span-2 bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center space-x-4">
                <div className="text-5xl text-[#346f73]">
                  <FaUserCircle />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {profile.name}
                  </h2>
                  <p className="text-gray-500 flex items-center gap-2">
                    <FaEnvelope /> {profile.email}
                  </p>
                  <p className="text-gray-500 flex items-center gap-2">
                    <FaPhone /> {profile.phone}
                  </p>
                  <p className="text-gray-500 flex items-center gap-2">
                    <FaIdBadge /> {profile.registrationNumber}
                  </p>
                  <div className="mt-2">
                    {profile.status === "verified" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <FaCheckCircle className="mr-1" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <FaTimesCircle className="mr-1" /> Not Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FaChartBar className="text-[#346f73]" /> Analytics
              </h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Certificates</span>
                  <span className="font-semibold text-[#346f73]">
                    {profile?.certificates?.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Reports</span>
                  <span className="font-semibold text-[#346f73]">
                    {profile?.reports?.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs + Content */}
          <div className="bg-white shadow rounded-xl">
            <div className="p-4">
              {/* Tabs */}
              <div className="border-b mb-4">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                  <button
                    onClick={() => handleTabChange("certificates")}
                    className={`${
                      activeTab === "certificates"
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Certificates
                  </button>
                  <button
                    onClick={() => handleTabChange("reports")}
                    className={`${
                      activeTab === "reports"
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Reports
                  </button>
                </nav>
              </div>

              {/* Certificate Cards */}
              {activeTab === "certificates" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile?.certificates.map((certificate) => (
                    <div
                      key={certificate._id}
                      className="bg-gray-100 rounded-lg shadow p-4"
                    >
                      <h4 className="text-sm font-bold text-gray-700 mb-2">
                        Certificate ID: {certificate._id}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        Created At:{" "}
                        {new Date(certificate.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex space-x-4 mt-2">
                        <button
                          onClick={() =>
                            handleViewCertificate(certificate.certificateUrl)
                          }
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <AiOutlineEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleRevokeCertificate(certificate._id)
                          }
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Report Cards */}
              {activeTab === "reports" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile?.reports.map((report) => (
                    <div
                      key={report._id}
                      className="bg-gray-100 rounded-lg shadow p-4"
                    >
                      <h4 className="text-sm font-bold text-gray-700 mb-2">
                        Report ID: {report._id}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Certificate ID:{" "}
                        {report.certificate._id || report.certificate}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Comment: {report.comment}
                      </p>
                      <p className="text-gray-600 text-sm mb-2">
                        Date: {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex space-x-4 mt-2">
                        <button
                          onClick={() =>
                            handleViewCertificate(
                              report.certificate.certificateUrl ||
                                report.certificate
                            )
                          }
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <AiOutlineEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleRevokeCertificate(
                              report.certificate._id || report.certificate
                            )
                          }
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
