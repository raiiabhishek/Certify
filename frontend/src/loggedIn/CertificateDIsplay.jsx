import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
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

  const shareOnSocialMedia = (platform) => {
    if (!pdfUrl) {
      return;
    }
    let url;

    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          pdfUrl
        )}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          pdfUrl
        )}&text=Check%20out%20my%20certificate!`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
          pdfUrl
        )}&title=My%20Certificate&summary=Check%20out%20my%20certificate!`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=Check%20out%20my%20certificate!%20${encodeURIComponent(
          pdfUrl
        )}`;
        break;
      default:
        return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
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
              className="w-full h-[600px]" // Set the height and width
            ></iframe>
          </div>

          {/* Sharing Icons */}
          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={() => shareOnSocialMedia("facebook")}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaFacebook size={24} />
            </button>
            <button
              onClick={() => shareOnSocialMedia("twitter")}
              className="text-blue-400 hover:text-blue-600"
            >
              <FaTwitter size={24} />
            </button>
            <button
              onClick={() => shareOnSocialMedia("linkedin")}
              className="text-blue-700 hover:text-blue-900"
            >
              <FaLinkedin size={24} />
            </button>
            <button
              onClick={() => shareOnSocialMedia("whatsapp")}
              className="text-green-500 hover:text-green-700"
            >
              <FaWhatsapp size={24} />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
