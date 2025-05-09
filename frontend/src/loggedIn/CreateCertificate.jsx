import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import Sidebar from "./Sidebar"; // Import the Sidebar
import Footer from "../Footer";
import { useNavigate, useSearchParams } from "react-router";

function CreateCertificate() {
  const api = import.meta.env.VITE_URL;
  const [searchParams, setSearchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");
  const { authToken } = useContext(AuthContext);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [templateVariables, setTemplateVariables] = useState({});
  const navigate = useNavigate();
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [bulkUploadFile, setBulkUploadFile] = useState(null); // State to store uploaded file
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false); // Loading state for bulk upload

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${api}/templates/getById/${templateId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setSelectedTemplate(response.data);
        if (response.data && response.data.variables) {
          const initialVars = response.data.variables.reduce(
            (acc, variable) => {
              acc[variable] = "";
              return acc;
            },
            {}
          );

          setTemplateVariables(initialVars);
        }

        setError(null);
      } catch (error) {
        console.error("Error fetching templates:", error);
        setSelectedTemplate(null);
        setError("Could not fetch template");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [authToken, api, templateId]);

  const handleVariableChange = (event) => {
    const { name, value } = event.target;
    setTemplateVariables((prevVars) => ({
      ...prevVars,
      [name]: value,
    }));
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

  const onGenerateCertificate = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${api}/certificate/generate/${templateId}`,
        templateVariables,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("generated succesfully");
        navigate(`/certificates/${response.data.pdfPath}`);
        setLoading(false);
      }

      console.log("Certificate generation response:", response);
    } catch (error) {
      console.error("Error during certificate generation:", error);
      // Handle the error appropriately, maybe show a message to the user
      setError("Error generating certificate");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUploadClick = () => {
    setShowBulkUploadModal(true);
  };

  const handleBulkUploadFileChange = (event) => {
    setBulkUploadFile(event.target.files[0]);
  };

  const handleBulkUploadSubmit = async () => {
    if (!bulkUploadFile) {
      alert("Please select a file to upload.");
      return;
    }

    setBulkUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("files", bulkUploadFile); // Ensure the field name is "files"

      const response = await axios.post(
        `${api}/certificate/bulk-generate/${templateId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Bulk upload successful", response.data);
        // Handle successful bulk upload (e.g., display success message)
        alert("Certificates generated successfully!");
      } else {
        console.error("Bulk upload failed", response.data);
        // Handle error (e.g., display error message)
        alert("Bulk certificate generation failed.");
      }
    } catch (error) {
      console.error("Error during bulk upload:", error);
      alert("An error occurred during bulk certificate generation.");
    } finally {
      setBulkUploadLoading(false);
      setShowBulkUploadModal(false); // Close the modal after upload
      setBulkUploadFile(null); // Clear selected file
    }
  };

  const handleCloseModal = () => {
    setShowBulkUploadModal(false);
    setBulkUploadFile(null); // Optionally clear the selected file when closing the modal
  };

  if (loading) {
    return <p className="text-center mt-8">Loading template...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar /> {/* Render the Sidebar */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col">
        <main className="flex-1 overflow-hidden">
          <div className="p-4">
            <div className="flex flex-col lg:flex-row">
              {/* Input Fields on the Left */}
              <div className="lg:w-1/4 border-r p-5 flex flex-col">
                <div className="mb-5 p-3 border rounded bg-gray-100">
                  <h2 className="mb-3 font-semibold text-lg">Enter Fields</h2>
                  {selectedTemplate?.variables ? (
                    selectedTemplate.variables.map((variable) => (
                      <div key={variable} className="mb-4">
                        <label
                          htmlFor={variable}
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          {variable.charAt(0).toUpperCase() + variable.slice(1)}
                          :
                        </label>
                        <input
                          type="text"
                          id={variable}
                          name={variable}
                          value={templateVariables[variable] || ""}
                          onChange={handleVariableChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">
                      No fields available for this template
                    </p>
                  )}
                </div>
              </div>

              {/* Preview Area on the Right */}
              <div className="flex-1 p-5 relative">
                <div className="flex justify-between mb-3">
                  <h2 className="mb-4 font-semibold text-lg">Preview</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={onGenerateCertificate}
                      className=" bg-green-500 text-white p-2 rounded cursor-pointer hover:bg-green-600 "
                    >
                      Generate Certificate
                    </button>
                    <button
                      onClick={handleBulkUploadClick}
                      className="bg-blue-500 text-white p-2 rounded cursor-pointer hover:bg-blue-600"
                    >
                      Bulk Generate
                    </button>
                  </div>
                </div>

                <div className="border rounded p-5 max-w-full overflow-auto">
                  {renderPreview()}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Upload Spreadsheet for Bulk Certificate Generation
              </h3>
              <div className="mt-2 px-7 py-3">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleBulkUploadFileChange}
                />
              </div>
              <div className="items-center px-4 py-3">
                <button
                  className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                  onClick={handleBulkUploadSubmit}
                  disabled={bulkUploadLoading}
                >
                  {bulkUploadLoading ? "Uploading..." : "Upload and Generate"}
                </button>
                <button
                  className="mt-2 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateCertificate;
