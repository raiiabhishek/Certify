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
    }
  }, [templateType, allTemplates]);

  const handleTypeChange = (event) => {
    setTemplateType(event.target.value);
  };

  const handleGenerateCertificate = (templateId) => {
    navigate(`/createCertificate/?templateId=${templateId}`);
  };

  if (loading) {
    return <p className="text-center mt-8">Loading templates...</p>;
  }

  const MiniPreview = ({ htmlContent, templateId, onGenerate }) => {
    const previewWidth = 450; // Adjust as needed
    const previewHeight = 450; // Adjust as needed

    return (
      <div
        className="mini-preview border rounded p-2 overflow-hidden cursor-pointer flex items-center justify-center"
        onClick={() => onGenerate(templateId)}
        style={{ width: `${previewWidth}px`, height: `${previewHeight}px` }} // Fixed size
      >
        <div
          className="overflow-hidden"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{
            fontSize: "0.4em",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }} // Ensure content fits
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex flex-1 overflow-hidden ">
        {/* Template List on the Left */}
        <div className="w-full border-r p-5 flex flex-col">
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

          <ul className="overflow-y-auto flex-1 pr-3 grid grid-cols-3 gap-4">
            {filteredTemplates && filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <li key={template._id} className="mb-2">
                  <MiniPreview
                    htmlContent={template.htmlContent}
                    templateId={template._id}
                    onGenerate={handleGenerateCertificate}
                  />
                </li>
              ))
            ) : (
              <p className="text-gray-600">
                No templates available for the given type
              </p>
            )}
          </ul>
        </div>

        {/* No Preview Area on the Right anymore */}
      </div>
      <Footer />
    </div>
  );
}

export default TemplateSelector;
