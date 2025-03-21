import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import Nav from "./Nav";
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
        navigate(`/certificate/${response.data.pdfPath}`);
        setLoading(false);
      }

      console.log("Certificate generation response:", response);
    } catch (error) {
      console.error("Error during certificate generation:", error);
      // Handle the error appropriately, maybe show a message to the user
      setError("Error generating certificate");
    }
  };

  if (loading) {
    return <p className="text-center mt-8">Loading template...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex flex-1 overflow-hidden ">
        {/* Input Fields on the Left */}
        <div className="w-1/4 border-r p-5 flex flex-col">
          <div className="mb-5 p-3 border rounded bg-gray-100">
            <h2 className="mb-3 font-semibold text-lg">Enter Fields</h2>
            {selectedTemplate?.variables ? (
              selectedTemplate.variables.map((variable) => (
                <div key={variable} className="mb-4">
                  <label
                    htmlFor={variable}
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    {variable.charAt(0).toUpperCase() + variable.slice(1)}:
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
            <button
              onClick={onGenerateCertificate}
              className=" bg-green-500 text-white p-2 rounded cursor-pointer hover:bg-green-600 "
            >
              Generate Certificate
            </button>
          </div>

          <div className="border rounded p-5 max-w-full overflow-auto">
            {renderPreview()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CreateCertificate;
