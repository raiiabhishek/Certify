import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";

export default function CertificatesList() {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${api}/certificate/`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (result.status === 200) {
          setCertificates(result.data.data);
        } else {
          setError(result.data.msg);
        }
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api, authToken]);

  useEffect(() => {
    let filteredList = certificates;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredList = filteredList.filter((certificate) => {
        const combinedText =
          `${certificate.template.name} ${certificate.template.type} ${certificate.creator.name} ${certificate.creator.email}`.toLowerCase();
        return combinedText.includes(term);
      });
    }
    setFilteredCertificates(filteredList);
  }, [certificates, searchTerm]);

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
        setCertificates((prev) =>
          prev.map((certificate) =>
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

  const numberToText = (inputString) => {
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

    return inputString
      .split("")
      .map((char) => numberMapping[char] || char)
      .join("");
  };

  const handleViewCertificate = (certificateId) => {
    const enc = numberToText(certificateId);
    navigate(`${enc}`);
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
          <h2 className="text-3xl text-[#2c4036] font-bold mb-4">
            Manage Certificates
          </h2>

          {/* Search */}
          <div className="mb-6 flex items-center space-x-2 flex-wrap md:flex-nowrap">
            <input
              type="text"
              placeholder="Search by name, type, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-2 w-full sm:w-auto mb-2 md:mb-0 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Cards Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCertificates.map((certificate) => (
              <div
                key={certificate._id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-[#2c4036]">
                  {certificate.template.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Type:</strong> {certificate.template.type}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Creator:</strong> {certificate.creator.name}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Email:</strong> {certificate.creator.email}
                </p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() =>
                      handleViewCertificate(certificate.certificateUrl)
                    }
                    className="text-blue-500 hover:bg-gray-100 rounded-full p-2"
                  >
                    <AiOutlineEye size={20} />
                  </button>
                  <button
                    onClick={() => handleCertificateRevoke(certificate._id)}
                    className="text-red-500 hover:bg-gray-100 rounded-full p-2"
                  >
                    <AiOutlineDelete size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
