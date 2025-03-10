import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiHome, FiMapPin } from "react-icons/fi";
import { ethers } from "ethers";
import contractABI from "./../../contractABI.json";
import { SignedIn } from "@clerk/clerk-react";

const contractAddress = "0x3d36F275F55cF1121eC6cA6C325954BdD3a9c868";

async function loadContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  return contract;
}

async function fetchProperties() {
  const contract = await loadContract();
  const properties = await contract.FetchProperties();
  return properties;
}

function Explore() {
  const [hovered, setHovered] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [allProperties, setAllProperties] = useState([]); // All fetched properties
  const [currentProperties, setCurrentProperties] = useState([]); // Filtered properties for display
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const propertiesPerPage = 12;
  const [noData, setNoData] = useState(false);

  const fetchInitialProperties = useCallback(async () => {
    try {
      setIsProcessing(true);
      setNoData(false);
      const fetchedProperties = await fetchProperties();
      const parsedProperties = fetchedProperties.map((property) => ({
        ...property,
        price: ethers.utils.formatEther(property.price), // Format price for display
      }));
      setAllProperties(parsedProperties);
      setCurrentProperties(parsedProperties); // Initially show all properties
    } catch (error) {
      console.error("Error fetching initial properties:", error);
      setNoData(true);
      setAllProperties([]);
      setCurrentProperties([]);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialProperties();
  }, [fetchInitialProperties]);

  // Update filtering based on Javascript logic.
  useEffect(() => {
    if (isProcessing) return;

    const filtered = allProperties.filter((property) => {
      let match = true;

      if (selectedType && property.category !== selectedType) {
        match = false;
      }

      if (selectedLocation && property.propertyAddress !== selectedLocation) {
        match = false;
      }

      return match;
    });

    setCurrentProperties(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
    setNoData(filtered.length === 0);
  }, [selectedType, selectedLocation, allProperties, isProcessing]);

  const handleTypeSelection = (type) => {
    setSelectedType(type);
  };

  const handleLocationSelection = (location) => {
    setSelectedLocation(location);
  };

  const displayedProperties = currentProperties.slice(
    (currentPage - 1) * propertiesPerPage,
    currentPage * propertiesPerPage
  );

  return (
    <SignedIn>
      <div className="flex p-6 min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        {/* Left Sidebar for Filters */}
        <div className="w-1/4 p-6 bg-gradient-to-b from-indigo-100 to-indigo-300 rounded-lg shadow-lg mr-6">
          <h2 className="text-2xl font-semibold text-indigo-900 mb-6">
            Filter Properties
          </h2>

          {/* Property Type Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Property Type
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {["Land", "Commercial", "Apartment", "Villa"].map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeSelection(type)}
                  className={`w-full p-2 text-sm rounded-lg transition-colors ${
                    selectedType === type
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  } hover:bg-indigo-700 hover:text-white`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Locations
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                "Kaloor, Kochi",
                "Delhi, India",
                "New York, USA",
                "London, UK",
                "Dubai, UAE",
              ].map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationSelection(location)}
                  className={`w-full p-2 text-sm rounded-lg transition-colors ${
                    selectedLocation === location
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  } hover:bg-indigo-700 hover:text-white`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-3/4">
          <div className="font-bold p-4 w-full h-auto text-left mb-6">
            <h1 className="text-4xl text-indigo-800">
              Explore All Properties
            </h1>
          </div>
          {noData ? (
            <div className="text-center text-gray-500">
              No properties found.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProperties.map((p, index) => {
                  const image =
                    Array.isArray(p.images) && p.images.length > 0
                      ? p.images[0]
                      : "placeholder_image_url";

                  return (
                    <motion.div
                      key={index}
                      className="relative bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transition-all"
                      onMouseEnter={() => setHovered(index)}
                      onMouseLeave={() => setHovered(null)}
                      whileHover={{
                        scale: 1.05,
                        zIndex: 10,
                      }}
                      style={{
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        boxShadow:
                          hovered === index
                            ? "0 12px 30px rgba(0,0,0,0.15)"
                            : "0 6px 18px rgba(0,0,0,0.1)",
                      }}
                    >
                      <motion.div
                        className="w-full h-48 object-cover bg-cover"
                        style={{ backgroundImage: `url(${image})` }}
                      />
                      <div className="p-4">
                        <h2 className="font-semibold text-lg text-gray-800">
                          {p.propertyTitle}
                        </h2>
                        <p className="text-gray-600 flex items-center">
                          <FiMapPin className="mr-2 text-indigo-600" />{" "}
                          {p.propertyAddress}
                        </p>
                        <p className="text-indigo-600 font-semibold flex items-center">
                          <FiHome className="mr-2" /> ₹{p.price.toLocaleString()}
                        </p>
                      </div>

                      {hovered === index && (
                        <motion.div
                          className="absolute inset-0 bg-white flex p-6 rounded-lg shadow-xl"
                          initial={{ opacity: 0, transform: "scale(0.9)" }}
                          animate={{ opacity: 1, transform: "scale(1)" }}
                          exit={{ opacity: 0, transform: "scale(0.9)" }}
                          style={{
                            zIndex: 20,
                            display: "flex",
                            transition: "transform 0.5s ease",
                          }}
                        >
                          <div className="w-1/2 h-64 object-cover overflow-hidden rounded-lg mr-6">
                            <motion.img
                              src={image}
                              alt={p.propertyTitle}
                              className="w-full h-full object-cover rounded-md"
                              initial={{ scale: 1 }}
                              animate={{ scale: 1.05 }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          <div className="flex-1">
                            <h2 className="text-xl font-semibold">
                              {p.propertyTitle}
                            </h2>
                            <p className="text-gray-700">Size: {p.size}</p>
                            <p className="text-gray-700">Owner: {p.owner}</p>
                            <p className="text-gray-700">Contact: {p.contact}</p>
                            <Link
                              to={`/property/${p.productID}`}
                              className="mt-4 inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                            >
                              View Details
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-6">
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 mr-2"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-xl">
                  {currentPage} /{" "}
                  {Math.ceil(currentProperties.length / propertiesPerPage)}
                </span>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 ml-2"
                  disabled={
                    currentPage ===
                    Math.ceil(currentProperties.length / propertiesPerPage)
                  }
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </SignedIn>
  );
}

export default Explore;