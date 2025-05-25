import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router";
import Sidebar from "./Sidebar";
import Footer from "../Footer";
import { AuthContext } from "../../AuthContext";
import Nav from "../Nav";
const api = import.meta.env.VITE_URL;

export default function ReviewCertificate() {
  const { certificateId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateVariables, setTemplateVariables] = useState({});
  const [reportModalOpen, setReportModalOpen] = useState(false); // State to manage report modal visibility
  const [reportReason, setReportReason] = useState(""); // State to store the report reason
  const { authToken } = useContext(AuthContext);

  function textToNumber(inputString) {
    const numberMappingReverse = {
      abc: "0",
      def: "1",
      ghi: "2",
      jkl: "3",
      mno: "4",
      pqr: "5",
      stu: "6",
      vwx: "7",
      yza: "8",
      bcd: "9",
    };

    let outputString = "";

    for (let i = 0; i < inputString.length; i += 3) {
      const batch = inputString.substring(i, i + 3); // Extract a 3-character batch

      if (numberMappingReverse[batch]) {
        outputString += numberMappingReverse[batch]; // If the batch is a code, add the corresponding number
      } else {
        outputString += batch; // Otherwise, keep the batch as it is
      }
    }

    return outputString;
  }

  useEffect(() => {
    const fetchCertificateData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${api}/certificate/review/${certificateId}`
        );
        setData(response.data);
        const res = await axios.get(
          `${api}/templates/getById/${response.data.templateId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setSelectedTemplate(res.data);

        if (
          res.data &&
          res.data.variables &&
          response.data &&
          response.data.keys &&
          response.data.values
        ) {
          if (response.data.keys.length === response.data.values.length) {
            const initialVars = response.data.keys.reduce((acc, key, index) => {
              acc[key] = response.data.values[index] || "";
              return acc;
            }, {});

            setTemplateVariables(initialVars);
          } else {
            console.error(
              "Keys and values array lengths do not match in the response"
            );
            setError(
              "Mismatch between keys and values array, couldn't set template variables"
            );
          }
        }
      } catch (err) {
        setError(err.message || "Failed to fetch certificate data.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateData();
  }, [certificateId, authToken]);

  const handleReportClick = () => {
    setReportModalOpen(true);
  };

  const closeReportModal = () => {
    setReportModalOpen(false);
    setReportReason(""); // Reset the reason
  };

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      alert("Please enter a reason for reporting.");
      return;
    }
    try {
      const response = await axios.post(
        `${api}/certificate/report/${certificateId}`,
        {
          comment: reportReason,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 201) {
        alert("Report submitted successfully!");
        closeReportModal(); // Close modal on success
      } else {
        alert("Failed to submit report.");
      }
    } catch (error) {
      console.error("Error submitting report: ", error);
      alert("Error submitting report.");
    }
  };

  const renderPreview = () => {
    if (!selectedTemplate) {
      return <p className="text-gray-600">No template selected</p>;
    }
    let previewContent = selectedTemplate.htmlContent;
    Object.keys(templateVariables).forEach((key) => {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g");
      previewContent = previewContent.replace(regex, templateVariables[key]);
    });

    return (
      <div
        className="certificate-preview "
        dangerouslySetInnerHTML={{
          __html: previewContent,
        }}
      />
    );
  };

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-4 text-red-600">Error: {error}</div>;
  }

  return authToken ? (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64 flex flex-col">
        <main className="container mx-auto p-4">
          <button
            onClick={handleReportClick}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Report
          </button>
          {renderPreview()}
        </main>

        {/* Report Modal */}
        {reportModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-5 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Report Certificate</h2>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Please enter the reason for reporting this certificate."
                className="border rounded p-2 w-full mb-4"
              ></textarea>
              <div className="flex justify-end">
                <button
                  onClick={closeReportModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportSubmit}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </div>
  ) : (
    <div className="min-h-screen">
      <Nav />
      <main className="container mx-auto p-4">
        <button
          onClick={handleReportClick}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Report
        </button>
        {renderPreview()}
      </main>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-5 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Report Certificate</h2>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Please enter the reason for reporting this certificate."
              className="border rounded p-2 w-full mb-4"
            ></textarea>
            <div className="flex justify-end">
              <button
                onClick={closeReportModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
