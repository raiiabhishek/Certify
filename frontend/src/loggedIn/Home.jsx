import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import { AuthContext } from "../../AuthContext";
import axios from "axios";
import Footer from "../Footer";
import { PieChart, Pie, Cell, Legend } from "recharts";

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
  }, [authToken]);

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
  const COLORS = ["#0088FE", "#00C49F"];

  const handleViewCertificate = (certificateId) => {
    navigate(`${certificateId}`);
  };

  const handleRevokeCertificate = async (certificateId) => {
    if (window.confirm("Are you sure you want to revoke this certificate?")) {
      try {
        await axios.delete(`${api}/certificates/${certificateId}`, {
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
    <div>
      <Nav />
      <div className="px-4 lg:px-8 xl:px-10 my-5 xl:my-10 space-y-8 xl:space-y-20 mx-auto max-w-7xl">
        <div className="relative">
          <h1 className="mx-auto text-center text-xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-bold ">
            Welcome <span className="text-blue">{user.name} </span> !
          </h1>
        </div>
        <div className="flex justify-center flex-col md:flex-row items-center md:items-start">
          <div className="w-full md:w-1/2 flex justify-center ">
            <PieChart width={300} height={300}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label
                outerRadius={100}
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
              <Legend />
            </PieChart>
          </div>
          {user?.certificates && user.certificates.length > 0 && (
            <div className="mt-8 w-full md:w-1/2">
              <h2 className="text-2xl font-bold mb-4 text-center">
                Your Certificates
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {user.certificates.map((certificate) => (
                  <div
                    key={certificate._id}
                    className="bg-white shadow-md rounded-lg p-4 w-full sm:w-80"
                  >
                    <h3 className="font-semibold text-lg mb-2">
                      Certificate ID: {certificate._id}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Created At:{" "}
                      {new Date(certificate.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() =>
                          handleViewCertificate(certificate.certificateUrl)
                        }
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        View Certificate
                      </button>
                      <button
                        onClick={() => handleRevokeCertificate(certificate._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Reports Table */}
        {user?.reports && user.reports.length > 0 && (
          <div className="overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Your Reports
            </h2>
            <div className="flex justify-center">
              <table className="min-w-full divide-y divide-gray-200 w-full sm:w-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report ID
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.certificate._id || report.certificate}
                      </td>
                      <td className="px-6 py-4 ">{report.comment}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            handleViewCertificate(
                              report.certificate.certificateUrl ||
                                report.certificate
                            )
                          }
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                          View Certificate
                        </button>
                        <button
                          onClick={() =>
                            handleRevokeCertificate(
                              report.certificate._id || report.certificate
                            )
                          }
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* {user?.certificates && user.certificates.length > 0 && (
          <div className="overflow-x-auto mt-8 ">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Your Certificates
            </h2>
            <div className="flex justify-center">
              <table className="divide-y divide-gray-200 w-full sm:w-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Certificate ID
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        {certificate._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(certificate.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            handleViewCertificate(certificate.certificateUrl)
                          }
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                          View Certificate
                        </button>
                        <button
                          onClick={() =>
                            handleRevokeCertificate(certificate._id)
                          }
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )} */}

        {user?.reports && user.reports.length === 0 && (
          <div className="text-center text-gray-500">No reports found.</div>
        )}
      </div>
      <Footer />
    </div>
  );
}
