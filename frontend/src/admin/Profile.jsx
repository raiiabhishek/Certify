import React, { useState, useEffect, useContext } from "react";
import { AiOutlineEye } from "react-icons/ai";
import axios from "axios";
import { useParams } from "react-router";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Nav";

const ProfilePage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("certificates");
  const [searchTerm, setSearchTerm] = useState("");
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
        console.log(response);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "An error occurred");
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const data = [
    { name: "Certificates", value: profile?.certificates?.length || 0 },
    { name: "Reports", value: profile?.reports?.length || 0 },
  ];
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

    let outputString = "";
    for (let i = 0; i < inputString.length; i++) {
      const char = inputString[i];
      if (numberMapping[char]) {
        outputString += numberMapping[char];
      } else {
        outputString += char;
      }
    }
    return outputString;
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

        const response = await axios.get(`${api}/profile/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        setProfile(response.data.data);

        alert("Certificate revoked successfully!");
      } catch (e) {
        console.error("Failed to revoke certificate:", e);
        alert("Failed to revoke certificate.");
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Profile and Analytics */}
        <div className="p-4">
          {/* Profile Card */}
          <div className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div>
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="text-gray-600">{profile.email}</p>
                {profile.status == "verified" ? (
                  <span className="text-green-500 font-semibold">Verified</span>
                ) : (
                  <span className="text-red-500 font-semibold">
                    Not Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Analytics Card */}
          <div className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-semibold">Analytics</h3>
                <p>Certificates: {profile?.certificates.length}</p>
                <p>Reports: {profile?.reports.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates and Reports Content */}
        <div className="flex-1 overflow-y-scroll p-4">
          <div className="bg-white shadow rounded-lg">
            {/* Content */}
            <div className="p-4">
              {/* Tab Navigation */}
              <div className="border-b">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                  <button
                    onClick={() => handleTabChange("certificates")}
                    className={`${
                      activeTab === "certificates"
                        ? "border-indigo-500 text-indigo-600 focus:outline-none"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Certificates
                  </button>
                  <button
                    onClick={() => handleTabChange("reports")}
                    className={`${
                      activeTab === "reports"
                        ? "border-indigo-500 text-indigo-600 focus:outline-none"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Reports
                  </button>
                </nav>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {activeTab === "reports" && (
                  <div>
                    {/* Search Bar */}
                    <input
                      type="text"
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="mb-4 p-2 border rounded w-full"
                    />
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
                        {filteredReports?.map((report) => (
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
                                      report.certificate._id ||
                                        report.certificate
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
                )}

                {activeTab === "certificates" && (
                  <div>
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
                        {profile?.certificates.map((certificate) => (
                          <tr key={certificate._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {certificate._id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(
                                certificate.createdAt
                              ).toLocaleDateString()}
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
