import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router";

function TemplateSelector() {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const [allTemplates, setAllTemplates] = useState([]);
  const [filteredByType, setFilteredByType] = useState({});
  const [expandedType, setExpandedType] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const templateTypes = [
    { type: "education", desc: "For academic achievements and certificates." },
    { type: "seminar", desc: "For attending or organizing seminars." },
    { type: "training", desc: "Professional or skill-development trainings." },
    { type: "workshop", desc: "Certificates for workshop participation." },
    { type: "participation", desc: "General participation acknowledgments." },
    { type: "competition", desc: "Certificates for contests or events." },
    { type: "job", desc: "Job offers or employment confirmation templates." },
    {
      type: "internship",
      desc: "Internship experience or completion formats.",
    },
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

        const grouped = {};
        templateTypes.forEach(({ type }) => {
          grouped[type] = response.data.filter(
            (template) => template.type === type
          );
        });

        setAllTemplates(response.data);
        setFilteredByType(grouped);
        setError(null);
      } catch (error) {
        console.error("Error fetching templates:", error);
        setAllTemplates([]);
        setError("Could not fetch templates.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [authToken, api]);

  const handleToggleExpand = (type) => {
    setExpandedType((prev) => (prev === type ? null : type));
  };

  const handleGenerateCertificate = (templateId) => {
    navigate(`/createCertificate/?templateId=${templateId}`);
  };

  const handlePreviewCategory = (type) => {
    const templates = filteredByType[type];
    if (templates && templates.length > 0) {
      // For demo: navigate to createCertificate for first template
      navigate(`/createCertificate/?templateId=${templates[0]._id}`);
    } else {
      alert("No templates available to preview in this category.");
    }
  };

  const MiniPreview = ({ htmlContent, templateId }) => (
    <div
      onClick={() => handleGenerateCertificate(templateId)}
      className="border rounded-xl shadow-md hover:shadow-lg transition cursor-pointer bg-white overflow-hidden flex items-center justify-center"
      style={{ width: "100%", height: "220px" }}
    >
      <div
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        style={{
          fontSize: "0.4em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium text-gray-700">
        Loading templates...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64 flex flex-col">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Choose a Certificate Template
            </h1>

            {error && (
              <p className="text-red-600 text-center mb-6 font-medium">{error}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {templateTypes.map(({ type, desc }) => (
                <div
                  key={type}
                  className="bg-white border rounded-xl shadow hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between px-5 py-4 cursor-pointer"
                       onClick={() => handleToggleExpand(type)}
                  >
                    <div>
                      <h3 className="text-xl font-semibold capitalize text-gray-800">
                        {type}
                      </h3>
                      <p className="text-sm text-gray-500">{desc}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {filteredByType[type]?.length || 0} template(s)
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handlePreviewCategory(type);
                      }}
                      className="text-[#346f73] hover:text-white font-semibold px-3 py-1 rounded border border-[#346f73] hover:bg-[#346f73] cursor-pointer"
                      type="button"
                    >
                      Preview
                    </button>
                  </div>

                  {expandedType === type && (
                    <div className="px-5 pb-5 grid gap-4">
                      {filteredByType[type]?.length > 0 ? (
                        filteredByType[type].map((template) => (
                          <MiniPreview
                            key={template._id}
                            htmlContent={template.htmlContent}
                            templateId={template._id}
                          />
                        ))
                      ) : (
                        <p className="text-gray-500 text-center mt-2 text-sm">
                          No templates available under this category.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TemplateSelector;
