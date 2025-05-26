import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import Sidebar from "./Sidebar";
import { useNavigate, useSearchParams } from "react-router";

function CreateCertificate() {
  const api = import.meta.env.VITE_URL;
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");
  const { authToken } = useContext(AuthContext);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [templateVariables, setTemplateVariables] = useState({});
  const navigate = useNavigate();
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);

  const certificateRef = useRef(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${api}/templates/getById/${templateId}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setSelectedTemplate(response.data);
        const initialVars = (response.data.variables || []).reduce((acc, v) => {
          acc[v] = "";
          return acc;
        }, {});
        setTemplateVariables(initialVars);
        setError(null);
      } catch (err) {
        setSelectedTemplate(null);
        setError("Could not fetch template");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [authToken, api, templateId]);

  const handleVariableChange = (e) => {
    const { name, value } = e.target;
    setTemplateVariables((prev) => ({ ...prev, [name]: value }));
  };

  const renderPreview = () => {
    if (!selectedTemplate) {
      return <p className="text-gray-600">No template selected</p>;
    }
    let preview = selectedTemplate.htmlContent;
    Object.entries(templateVariables).forEach(([key, val]) => {
      preview = preview.replace(
        new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g"),
        val
      );
    });
    return (
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: preview }}
      />
    );
  };

  const handlePrint = () => {
    const printContent = certificateRef.current;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // to reload React app back to original state
  };

  const onGenerateCertificate = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${api}/certificate/generate/${templateId}`,
        templateVariables,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (res.status === 200) {
        navigate(`/certificates/${res.data.pdfPath}`);
      }
    } catch {
      setError("Error generating certificate");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUploadSubmit = async () => {
    if (!bulkUploadFile) {
      alert("Please select a file to upload.");
      return;
    }
    setBulkUploadLoading(true);
    try {
      console.log(authToken);
      const formData = new FormData();
      formData.append("files", bulkUploadFile);
      const res = await axios.post(
        `${api}/certificate/bulk-generate/${templateId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data);
      alert(
        res.status === 200
          ? "Certificates generated successfully!"
          : "Bulk generation failed."
      );
    } catch {
      alert("An error occurred during bulk certificate generation.");
    } finally {
      setBulkUploadLoading(false);
      setShowBulkUploadModal(false);
      setBulkUploadFile(null);
    }
  };

  if (loading)
    return <p className="text-center mt-8 text-lg">Loading template...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64 flex flex-col">
        <main className="flex-1 overflow-y-auto p-6">
          {/* Top action buttons */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Create Certificate</h1>
            <div className="flex gap-3">
              <button
                onClick={onGenerateCertificate}
                className="bg-[#346f73] hover:bg-[#1B3B3D] text-white px-5 py-2 rounded-md"
              >
                Generate
              </button>
              <button
                onClick={() => setShowBulkUploadModal(true)}
                className="bg-[#346f73] hover:bg-[#1B3B3D] text-white px-5 py-2 rounded-md"
              >
                Bulk Upload
              </button>
            </div>
          </div>

          {/* Horizontal field input section */}
          <div className="flex flex-wrap gap-4 mb-8 bg-white p-5 rounded shadow">
            {selectedTemplate?.variables?.length ? (
              selectedTemplate.variables.map((variable) => (
                <div key={variable} className="flex flex-col w-60">
                  <label
                    htmlFor={variable}
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    {variable.charAt(0).toUpperCase() + variable.slice(1)}
                  </label>
                  <input
                    id={variable}
                    name={variable}
                    type="text"
                    value={templateVariables[variable]}
                    onChange={handleVariableChange}
                    className="px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No variables for this template.</p>
            )}
          </div>

          {/* Certificate Preview */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Certificate Preview
              </h2>
            </div>

            <div
              ref={certificateRef}
              className="relative border rounded-lg p-5 bg-gradient-to-br from-white to-gray-50 max-h-[80vh] overflow-auto shadow-inner"
            >
              <div className="min-h-[500px] bg-white border border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center">
                <div
                  className="prose max-w-full text-gray-800"
                  dangerouslySetInnerHTML={{
                    __html:
                      renderPreview()?.props?.dangerouslySetInnerHTML?.__html ||
                      "<p>No content</p>",
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#d0dbe4] bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Upload Excel File
            </h3>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => setBulkUploadFile(e.target.files[0])}
              className="block w-full mb-4 text-sm text-gray-700"
            />
            <button
              onClick={handleBulkUploadSubmit}
              disabled={bulkUploadLoading}
              className="w-full bg-[#346f73] hover:bg-[#1B3B3D] text-white font-medium py-2 px-4 rounded"
            >
              {bulkUploadLoading ? "Uploading..." : "Upload and Generate"}
            </button>
            <button
              onClick={() => {
                setShowBulkUploadModal(false);
                setBulkUploadFile(null);
              }}
              className="mt-2 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Print-specific styling */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #root, #root * {
              visibility: hidden;
            }
            #root > div > div > main > div > div:nth-child(3) > div {
              visibility: visible;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
}

export default CreateCertificate;
