import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import Nav from "./Nav";
import Footer from "../Footer";

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
          `${api}/templates/getById/${response.data.templateId}`
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
  }, [certificateId]);

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
      const response = await axios.post(`${api}/reports/create`, {
        certificateId: certificateId,
        reason: reportReason,
      });
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

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="container mx-auto p-4">
        {/* Report Button */}
        <button
          onClick={handleReportClick}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Report
        </button>

        {renderPreview()}
      </div>
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
  );
}
