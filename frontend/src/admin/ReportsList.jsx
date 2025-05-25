import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";

export default function ReportsList() {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${api}/certificate/reports/`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (result.status === 200) {
          setReports(result.data.data);
        } else {
          setError(result.data.msg);
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [api, authToken]);

  useEffect(() => {
    let filteredReportsList = reports;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredReportsList = filteredReportsList.filter((report) => {
        const searchString = `${report.certificate.template.name} ${report.certificate.template.type} ${report.certificate.creator.name} ${report.certificate.creator.email}`.toLowerCase();
        return searchString.includes(term);
      });
    }

    setFilteredCertificates(filteredReportsList);
  }, [reports, searchTerm]);

  const handleCertificateRevoke = async (certificateId) => {
    try {
      const result = await axios.get(
        `${api}/admin/revoke/certificate/${certificateId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (result.status === 200) {
        setReports((prevCertificates) =>
          prevCertificates.map((certificate) =>
            certificate._id === certificateId
              ? { ...certificate, status: "revoked" }
              : certificate
          )
        );
      } else {
        setError("Failed to update certificate status");
      }
    } catch (err) {
      setError("Failed to update certificate status.");
    }
  };

  const handleViewCertificate = (certificateUrl) => {
    navigate(`${certificateUrl}`);
  };

  if (loading)
    return <div className="text-center text-gray-700">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Nav />
      <div className="flex-grow overflow-y-auto">
        <div className="container mx-auto p-5 px-5 lg:px-10 flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Manage Reports</h2>

          {/* Search */}
          <div className="mb-6 flex items-center space-x-2 flex-wrap md:flex-nowrap">
            <input
              type="text"
              placeholder="Search by template, creator, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-2 w-full sm:w-auto mb-2 md:mb-0 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Cards Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCertificates.length === 0 ? (
              <div className="text-center text-gray-500 col-span-full">
                No reports found.
              </div>
            ) : (
              filteredCertificates.map((report) => (
                <div
                  key={report.certificate._id}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-black-600 mb-2">
                    {report.certificate.template.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Type:</strong> {report.certificate.template.type}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Creator:</strong> {report.certificate.creator.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Email:</strong> {report.certificate.creator.email}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Comment:</strong> {report.comment}
                  </p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() =>
                        handleViewCertificate(report.certificate.certificateUrl)
                      }
                      className="text-blue-500 hover:bg-gray-100 rounded-full p-2"
                    >
                      <AiOutlineEye size={20} />
                    </button>
                    <button
                      onClick={() =>
                        handleCertificateRevoke(report.certificate._id)
                      }
                      className="text-red-500 hover:bg-gray-100 rounded-full p-2"
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
