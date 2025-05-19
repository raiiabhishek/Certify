import React, { useState, useEffect, useContext, use } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { FaLinkedin, FaShare } from "react-icons/fa";
import { useParams } from "react-router";
import Footer from "../Footer";
import Sidebar from "./Sidebar";
import Nav from "../admin/Nav";
export default function CertificateDisplay() {
  const api = import.meta.env.VITE_URL;
  const { pdfPath } = useParams();
  const { authToken } = useContext(AuthContext);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { role } = useContext(AuthContext);
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
      const batch = inputString.substring(i, i + 3); // Extract a 3-character batch

      if (numberMappingReverse[batch]) {
        outputString += numberMappingReverse[batch]; // If the batch is a code, add the corresponding number
      } else {
        outputString += batch; // Otherwise, keep the batch as it is
      }
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
      <div className="min-h-screen flex">
        <div className="flex-1 ml-0 md:ml-64 flex flex-col">
          <div className="flex justify-center items-center h-screen">
            Loading certificate...
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex">
        <div className="flex-1 ml-0 md:ml-64 flex flex-col">
          <div className="flex justify-center items-center h-screen text-red-500">
            {error}
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="min-h-screen flex">
        <div className="flex-1 ml-0 md:ml-64 flex flex-col">
          <div className="flex justify-center items-center h-screen">
            No Certificate to display
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {role === "admin" ? <Nav /> : role === "user" ? <Sidebar /> : null}

      <div className="flex-1 ml-0 md:ml-34 flex flex-col">
        <main className="container mx-auto p-4 flex-grow">
          {" "}
          {/* Use flex-grow to fill available space */}
          <div className="bg-white shadow-md rounded-lg p-6 h-full flex flex-col">
            {" "}
            {/* Make the content area a flex container */}
            <div className="mb-4 border border-gray-200 rounded overflow-hidden flex-grow">
              {" "}
              {/* Use flex-grow on the iframe container */}
              <iframe
                src={pdfUrl}
                title="Certificate PDF"
                className="w-full h-full" // Make iframe take up the full height of its container
              ></iframe>
            </div>
            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={shareCertificate}
                className="text-blue-700 hover:text-blue-900"
              >
                <FaShare size={24} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
