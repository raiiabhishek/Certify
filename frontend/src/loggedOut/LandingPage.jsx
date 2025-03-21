import React from "react";
import Nav from "../Nav";
import Footer from "../Footer";

function LandingPage() {
  return (
    <div className="font-sans">
      {/* Header */}
      <Nav />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-100 to-blue-100 py-24 px-6 lg:px-12">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl font-bold mb-6 text-indigo-900 leading-tight">
              Issue & Verify Certificates Securely with Blockchain
            </h1>
            <p className="text-gray-700 mb-10 text-xl">
              Revolutionize your credentialing process with a tamper-proof
              system. Eliminate fraud and enhance trust using blockchain
              technology.
            </p>
            <div className="flex space-x-4">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-md shadow-md transition duration-300 ease-in-out">
                Get Started Today
              </button>
              <a
                href="#features"
                className="bg-transparent border border-indigo-600 hover:bg-indigo-50 text-indigo-700 font-bold py-3 px-8 rounded-md shadow-md transition duration-300 ease-in-out"
              >
                Explore Features
              </a>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img
              src="https://img.freepik.com/free-psd/3d-nft-icon-chain_629802-28.jpg?t=st=1741186213~exp=1741189813~hmac=da11f1082218b2c01e1577ed81c63e0dda6bf27487820457cba64b33a0afe54a&w=740"
              alt="Blockchain Certificate Illustration"
              className="rounded-lg shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-16 px-6 lg:px-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 text-indigo-900">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
              <h3 className="text-xl font-semibold mb-4 text-indigo-800">
                Tamper-Proof Certificates
              </h3>
              <p className="text-gray-700">
                Each certificate is secured on the blockchain, making it
                virtually impossible to forge.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
              <h3 className="text-xl font-semibold mb-4 text-indigo-800">
                Instant Verification
              </h3>
              <p className="text-gray-700">
                Verify certificates instantly using their unique blockchain ID.
                No more lengthy authentication processes.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
              <h3 className="text-xl font-semibold mb-4 text-indigo-800">
                Customizable & Beautiful Designs
              </h3>
              <p className="text-gray-700">
                Create visually stunning certificates with multiple themes, and
                custom images.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-indigo-100 py-20 px-6 lg:px-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-indigo-900">
            Ready to Embrace Secure Certification?
          </h2>
          <p className="text-gray-700 text-xl mb-10">
            Start issuing and verifying blockchain certificates with ease. Join
            the future of credential management.
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-md shadow-md transition duration-300 ease-in-out">
            Get Started Now
          </button>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-16 px-6 lg:px-12 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-indigo-900 text-center">
            Why Choose Our System?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition duration-300 ease-in-out">
              <h3 className="text-xl font-semibold mb-4 text-indigo-800">
                Unparalleled Security
              </h3>
              <p className="text-gray-700">
                Leverage the power of blockchain for tamper-proof certificates.
                Your credentials are safe and verifiable.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition duration-300 ease-in-out">
              <h3 className="text-xl font-semibold mb-4 text-indigo-800">
                Efficiency and Automation
              </h3>
              <p className="text-gray-700">
                Automate the certification process, saving time and resources.
                Our system streamlines the entire workflow.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition duration-300 ease-in-out">
              <h3 className="text-xl font-semibold mb-4 text-indigo-800">
                Global Verifiability
              </h3>
              <p className="text-gray-700">
                Certificates issued with our system can be verified anywhere in
                the world through the blockchain.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition duration-300 ease-in-out">
              <h3 className="text-xl font-semibold mb-4 text-indigo-800">
                Cost-Effective Solution
              </h3>
              <p className="text-gray-700">
                Reduce administrative overhead and eliminate the costs
                associated with traditional paper certificates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
