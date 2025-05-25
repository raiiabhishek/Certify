import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../AuthContext";
import {
  FaLinkedin,
  FaShareAlt,
  FaFacebookF,
  FaEnvelope,
} from "react-icons/fa";
import { useParams } from "react-router";
import Footer from "../Footer";
import Sidebar from "./Sidebar";
import Nav from "../admin/Nav";

export default function CertificateDisplay() {
  const api = import.meta.env.VITE_URL;
  const { pdfPath } = useParams();
  const { authToken, role } = useContext(AuthContext);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      const batch = inputString.substring(i, i + 3);
      outputString += numberMappingReverse[batch] || batch;
    }
    return outputString;
  }

  useEffect(() => {
    const fetchCertificate = async () => {
      setLoading(true);
      setError(null);

      try {
        const cert = textToNumber(pdfPath);
        const certificateURL = `${api}/certificates/${cert}`;
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

    if (window.MicrosoftSharePlugin?.share) {
      window.MicrosoftSharePlugin.share({
        url: pdfUrl,
        title: "My Certificate",
        summary: "Check out my certificate!",
      });
    } else if (navigator.share) {
      navigator
        .share({
          title: "My Certificate",
          text: "Check out my certificate!",
          url: pdfUrl,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      const url = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
        pdfUrl
      )}&title=My%20Certificate`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  if (loading || error || !pdfUrl) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        {role === "admin" ? <Nav /> : role === "user" ? <Sidebar /> : null}
        <div className="flex-1 ml-0 md:ml-64 flex flex-col justify-center items-center">
          <div className="text-center p-6">
            {loading ? (
              <p className="text-lg text-gray-600">Loading certificate...</p>
            ) : error ? (
              <p className="text-lg text-red-500">{error}</p>
            ) : (
              <p className="text-lg text-gray-600">No Certificate to display</p>
            )}
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {role === "admin" ? <Nav /> : role === "user" ? <Sidebar /> : null}

      <div className="flex-1 ml-0 md:ml-64 flex flex-col">
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="mb-4 border border-gray-300 rounded overflow-hidden h-[75vh]">
              <iframe
                src={pdfUrl}
                title="Certificate PDF"
                className="w-full h-full"
              ></iframe>
            </div>

            <div className="flex justify-center gap-3 mt-2">
              <button
                onClick={shareCertificate}
                className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                title="Share"
              >
                <FaShareAlt size={18} />
              </button>

              <a
                href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
                  pdfUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                title="LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  pdfUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800"
                title="Facebook"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href={`mailto:?subject=My Certificate&body=Check out my certificate: ${pdfUrl}`}
                className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-800"
                title="Email"
              >
                <FaEnvelope size={18} />
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
