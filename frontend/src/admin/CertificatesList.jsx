import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import Nav from "./Nav";
import Footer from "../Footer";
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
          console.log(result.data.data);
          setCertificates(result.data.data);
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
    // Filter and search logic for certificates
    let filteredCertificateList = certificates;

    // Search by any field (template name, template type, creator name, creator email)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredCertificateList = filteredCertificateList.filter(
        (certificate) => {
          const searchString =
            `${certificate.template.name} ${certificate.template.type} ${certificate.creator.name} ${certificate.creator.email}`.toLowerCase();
          return searchString.includes(term);
        }
      );
    }

    setFilteredCertificates(filteredCertificateList);
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
        setCertificates((prevCertificates) =>
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

  if (loading)
    return <div className="text-center text-gray-700">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Nav />
      <div className="flex-grow overflow-y-auto">
        <div className="flex-1 container mx-auto p-5 px-5 lg:px-10 flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Manage Certificates</h2>

          {/* Search and Filter */}
          <div className="mb-4 flex items-center space-x-2 flex-wrap md:flex-nowrap">
            <input
              type="text"
              placeholder="Search by anything"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-2 w-full sm:w-auto mb-2 md:mb-0 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Certificate List Table */}

          <div className="overflow-x-auto flex flex-col">
            <table className="min-w-full bg-white border border-gray-200 shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left w-1/5">
                    Template Name
                  </th>
                  <th className="py-2 px-4 border-b text-left w-1/5">
                    Template Type
                  </th>
                  <th className="py-2 px-4 border-b text-left w-1/5">
                    Creator Name
                  </th>
                  <th className="py-2 px-4 border-b text-left w-1/5">
                    Creator Email
                  </th>
                  <th className="py-2 px-4 border-b text-left w-1/5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.map((certificate) => (
                  <tr key={certificate._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {certificate.template.name}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {certificate.template.type}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {certificate.creator.name}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {certificate.creator.email}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() =>
                          handleViewCertificate(certificate.certificateUrl)
                        }
                        className="text-blue-500 hover:bg-gray-300  font-bold py-1 px-2 rounded mr-2"
                      >
                        <AiOutlineEye />
                      </button>
                      <button
                        onClick={() => handleCertificateRevoke(certificate._id)}
                        className="text-red-500 hover:bg-gray-300 font-bold py-1 px-2 rounded"
                      >
                        <AiOutlineDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
