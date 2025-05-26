import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  AiOutlineAlignCenter,
  AiOutlineFileText,
  AiOutlineEye,
  AiOutlineDelete,
} from "react-icons/ai";
import { AuthContext } from "../../AuthContext";
import axios from "axios";
import Sidebar from "./Sidebar";

const COLORS = ["#346f73", "#f3730e"];

export default function Home() {
  const api = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

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
    if (authToken) fetchProfile();
  }, [authToken, api]);

  const data = [
    { name: "Certificates", value: user?.certificates?.length || 0 },
    { name: "Reports", value: user?.reports?.length || 0 },
  ];

  const latestReports =
    user?.reports
      ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3) || [];

  const reportSummaryData = [
    { name: "Total Reports", value: user?.reports?.length || 0 },
    { name: "Recent Reports", value: latestReports.length },
  ];

  const numberToText = (inputString) => {
    const mapping = {
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
    return inputString
      .split("")
      .map((char) => mapping[char] || char)
      .join("");
  };

  const handleViewCertificate = (certificateId) => {
    const enc = numberToText(certificateId);
    navigate(`${enc}`);
  };

  const handleRevokeCertificate = async (certificateId) => {
    if (window.confirm("Are you sure you want to revoke this certificate?")) {
      try {
        await axios.delete(`${api}/certificate/revoke/${certificateId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const updatedReports = user.reports.filter(
          (r) =>
            r.certificate._id !== certificateId &&
            r.certificate !== certificateId
        );
        setUser({ ...user, reports: updatedReports });
        alert("Certificate revoked successfully!");
      } catch (e) {
        console.error("Failed to revoke certificate:", e);
        alert("Failed to revoke certificate.");
      }
    }
  };

  const renderCustomTooltip = ({ payload }) => {
    if (payload && payload.length) {
      const dataPoint = payload[0].payload;
      const percentage = (
        (dataPoint.value / data.reduce((sum, d) => sum + d.value, 0)) *
        100
      ).toFixed(2);
      return (
        <div className="backdrop-blur-md bg-white/30 p-2 border border-gray-200/50 shadow-md rounded-md">
          <p className="font-bold text-gray-800">{`${dataPoint.name}: ${percentage}%`}</p>
          <p className="text-gray-600">{`Value: ${dataPoint.value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );

  const latestCertificates = user?.certificates
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-4xl font-bold">
            Activity dashboard of{" "}
            <span className="text-[#2c4036]">{user?.name}</span>
          </h1>

          <div className="grid grid-cols-1 gap-8 mt-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                Document Distribution & Report Analytics
              </h2>
              <div className="flex flex-col md:flex-row gap-8">
                {/* Pie Chart */}
                <div className="flex-1 h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        onMouseEnter={(d, i) => setActiveIndex(i)}
                        onMouseLeave={() => setActiveIndex(null)}
                        activeIndex={activeIndex}
                      >
                        {data.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={renderCustomTooltip} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex-1 h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={reportSummaryData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value">
                        {reportSummaryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.name === "Total Reports"
                                ? "#346f73"
                                : "#f3730e"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow flex items-center">
                <AiOutlineAlignCenter className="h-8 w-8 text-[#346f73] mr-4" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Total Certificates
                  </h3>
                  <p className="text-2xl font-semibold text-[#346f73]">
                    {user?.certificates?.length || 0}
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow flex items-center">
                <AiOutlineFileText className="h-8 w-8 text-[#f3730e] mr-4" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Total Reports
                  </h3>
                  <p className="text-2xl font-semibold text-[#f3730e]">
                    {user?.reports?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            {latestCertificates.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Recent Certificates
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {latestCertificates.map((certificate) => (
                    <div
                      key={certificate._id}
                      className="bg-white p-4 rounded-lg shadow border"
                    >
                      <h3 className="text-md font-bold text-gray-800 mb-2">
                        Certificate ID
                      </h3>
                      <p className="text-gray-700 break-words">
                        {certificate._id}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(certificate.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center mt-4 space-x-4">
                        <button
                          onClick={() =>
                            handleViewCertificate(certificate.certificateUrl)
                          }
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <AiOutlineEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleRevokeCertificate(certificate._id)
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          <AiOutlineDelete className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {latestReports.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {latestReports.map((report) => (
                    <div
                      key={report._id}
                      className="bg-white p-4 rounded-lg shadow border"
                    >
                      <h3 className="text-md font-bold text-gray-800 mb-1">
                        Report ID
                      </h3>
                      <p className="text-gray-700 break-words">{report._id}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Certificate:{" "}
                        {typeof report.certificate === "object"
                          ? report.certificate._id
                          : report.certificate}
                      </p>
                      <p className="text-gray-600 mt-2 line-clamp-3">
                        {report.comment}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center mt-4 space-x-4">
                        <button
                          onClick={() =>
                            handleViewCertificate(
                              report.certificate?.certificateUrl ||
                                report.certificate
                            )
                          }
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <AiOutlineEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleRevokeCertificate(
                              report.certificate?._id || report.certificate
                            )
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          <AiOutlineDelete className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
