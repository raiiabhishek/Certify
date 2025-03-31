import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import {
  AiOutlineAlignCenter,
  AiOutlineFileText,
  AiOutlineEye,
} from "react-icons/ai";
import { AuthContext } from "../../AuthContext";
import axios from "axios";
import Nav from "./Nav";
import Footer from "../Footer";

const COLORS = ["#4F46E5", "#10B981"];

export default function Home() {
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
      <div className="flex justify-center items-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  const data = [
    { name: "Certificates", value: user?.certificates?.length || 0 },
    { name: "Reports", value: user?.reports?.length || 0 },
  ];

  const handleViewCertificate = (certificateId) => {
    navigate(`${certificateId}`);
  };

  const handleRevokeCertificate = async (certificateId) => {
    if (window.confirm("Are you sure you want to revoke this certificate?")) {
      try {
        await axios.delete(`${api}/certificate/revoke/${certificateId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const updatedReports = user.reports.filter(
          (report) =>
            report.certificate._id !== certificateId &&
            report.certificate !== certificateId
        );
        setUser({ ...user, reports: updatedReports });
        alert("Certificate revoked successfully!");
      } catch (e) {
        console.error("Failed to revoke certificate:", e);
        alert("Failed to revoke certificate.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative">
          <h1 className="mx-auto text-center text-xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-bold ">
            Welcome <span className="text-indigo-600">{user?.name} </span> !
          </h1>
        </div>
        <div className="grid grid-cols-1 gap-8 mt-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Document Distribution
            </h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
            <div className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row items-center">
              <AiOutlineAlignCenter className="h-8 w-8 text-indigo-600 mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Total Certificates
                </h3>
                <p className="text-2xl font-semibold text-indigo-600">
                  {user?.certificates?.length || 0}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row items-center">
              <AiOutlineFileText className="h-8 w-8 text-emerald-600 mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Total Reports
                </h3>
                <p className="text-2xl font-semibold text-emerald-600">
                  {user?.reports?.length || 0}
                </p>
              </div>
            </div>
          </div>

          {user?.certificates && user.certificates.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">
                Recent Certificates
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {user.certificates.map((certificate) => (
                      <tr key={certificate._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {certificate._id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(certificate.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleViewCertificate(
                                  certificate.certificateUrl
                                )
                              }
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <AiOutlineEye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() =>
                                handleRevokeCertificate(certificate._id)
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              <span className="text-red-600 hover:text-red-900">
                                Revoke
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {user?.reports && user.reports.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Certificate ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Comment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {user.reports.map((report) => (
                      <tr key={report._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {report._id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.certificate._id || report.certificate}
                        </td>
                        <td className="px-6 py-4  text-sm text-gray-500">
                          {report.comment}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
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
                              className="text-red-600 hover:text-red-900"
                            >
                              <span className="text-red-600 hover:text-red-900">
                                Revoke
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {user?.reports && user.reports.length === 0 && (
            <div className="text-center text-gray-500 lg:col-span-2">
              No reports found.
            </div>
          )}
          {user?.certificates && user.certificates.length === 0 && (
            <div className="text-center text-gray-500 lg:col-span-2">
              No certificate found.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
