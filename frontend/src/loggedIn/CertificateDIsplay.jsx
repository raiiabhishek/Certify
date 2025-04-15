import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { FaLinkedin } from "react-icons/fa";
import { useParams } from "react-router";
import Footer from "../Footer";
import Nav from "./Nav";

export default function CertificateDisplay() {
  const api = import.meta.env.VITE_URL;
  const { pdfPath } = useParams();
  const { authToken } = useContext(AuthContext);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      setLoading(true);
      setError(null);

      try {
        const certificateURL = `${api}/certificates/${pdfPath}`;
        setPdfUrl(certificateURL);
      } catch (err) {
        console.error("Error fetching certificate:", err);
        setError("Failed to load certificate. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (pdfPath) {
      fetchCertificate();
    } else {
      setError("No certificate ID provided.");
      setLoading(false);
    }
  }, [authToken, pdfPath]);

  const shareCertificate = () => {
    if (!pdfUrl) return;

    // Try using Microsoft share plugin if available
    if (
      window.MicrosoftSharePlugin &&
      typeof window.MicrosoftSharePlugin.share === "function"
    ) {
      window.MicrosoftSharePlugin.share({
        url: pdfUrl,
        title: "My Certificate",
        summary: "Check out my certificate!",
      });
    }
    // Fallback to the Web Share API if supported
    else if (navigator.share) {
      navigator
        .share({
          title: "My Certificate",
          text: "Check out my certificate!",
          url: pdfUrl,
        })
        .catch((err) => console.error("Error sharing:", err));
    }
    // Fallback to opening a LinkedIn share URL if none of the above work
    else {
      const url = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
        pdfUrl
      )}&title=My%20Certificate&summary=Check%20out%20my%20certificate!`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <div>
        <Nav />
        <div className="flex justify-center items-center h-screen">
          Loading certificate...
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div>
        <Nav />
        <div>No Certificate to display</div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4 border border-gray-200 rounded overflow-hidden">
            <iframe
              src={pdfUrl}
              title="Certificate PDF"
              className="w-full h-[600px]" // Set the height and width as needed
            ></iframe>
          </div>

          {/* Only LinkedIn Sharing Icon using the Microsoft Share Plugin */}
          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={shareCertificate}
              className="text-blue-700 hover:text-blue-900"
            >
              <FaLinkedin size={24} />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
