import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import Nav from "./Nav";
import Footer from "../Footer";
import { useNavigate } from "react-router";

function TemplateSelector({ onSelectTemplate }) {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [allTemplates, setAllTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [templateType, setTemplateType] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const templateTypes = [
    "all",
    "education",
    "seminar",
    "training",
    "workshop",
    "participation",
    "competition",
    "job",
    "internship",
  ];

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${api}/templates`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setAllTemplates(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching templates:", error);
        setAllTemplates([]);
        setError("Could not fetch templates");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [authToken, api]);

  useEffect(() => {
    if (allTemplates.length > 0) {
      if (templateType === "all") {
        setFilteredTemplates(allTemplates);
      } else {
        setFilteredTemplates(
          allTemplates.filter((template) => template.type === templateType)
        );
      }
      setSelectedTemplate(null);
    }
  }, [templateType, allTemplates]);

  const handleTypeChange = (event) => {
    setTemplateType(event.target.value);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    onSelectTemplate(template._id, template.name);
  };

  const onCreateCertificate = () => {
    navigate(`/createCertificate/?templateId=${selectedTemplate._id}`);
  };
  if (loading) {
    return <p className="text-center mt-8">Loading templates...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex flex-1 overflow-hidden ">
        {/* Template List on the Left */}
        <div className="w-1/4 border-r p-5 flex flex-col">
          <div className="mb-5 p-3 border rounded bg-gray-100">
            <h2 className="mb-3 font-semibold text-lg">Choose a Template</h2>
            <div className="flex items-center space-x-3 mb-4">
              <label
                htmlFor="templateType"
                className="p-2 border rounded bg-white"
              >
                Filter by Type:
              </label>
              <select
                id="templateType"
                value={templateType}
                onChange={handleTypeChange}
                className="p-2 border rounded bg-white"
              >
                {templateTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </div>

          <ul className="overflow-y-auto flex-1 pr-3">
            {filteredTemplates && filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <li key={template._id} className="mb-2">
                  <button
                    onClick={() => handleTemplateSelect(template)}
                    className="block w-full text-left p-2 rounded hover:bg-gray-200"
                  >
                    {template.name}
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-600">
                No templates available for the given type
              </p>
            )}
          </ul>
        </div>

        {/* Preview Area on the Right */}
        <div className="flex-1 p-5 relative">
          <div className="flex justify-between mb-3">
            <h2 className="mb-4 font-semibold text-lg">Preview</h2>
            <button
              onClick={onCreateCertificate}
              className=" bg-green-500 text-white p-2 rounded cursor-pointer hover:bg-green-600 "
            >
              Create Certificate
            </button>
          </div>

          <div className="border rounded p-5 max-w-full  overflow-auto">
            {selectedTemplate ? (
              <div
                className="certificate-preview "
                dangerouslySetInnerHTML={{
                  __html: selectedTemplate.htmlContent,
                }}
              />
            ) : (
              <p className="text-gray-600">No template selected</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TemplateSelector;
