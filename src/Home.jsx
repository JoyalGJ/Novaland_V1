import { Bell, Search, ChevronDown } from "lucide-react";
import banner from "./assets/banner.png";
import SearchBar from "./components/SearchBar.jsx";
import { ethers } from "ethers";
import contractABI from "./../contractABI.json"; // Update with your ABI file path
import React, { useEffect, useState, useCallback } from "react";

const contractAddress = "0x3d36F275F55cF1121eC6cA6C325954BdD3a9c868"; // Replace with your contract address

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

function Home() {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredProperties, setFilteredProperties] = useState([]); // State for filtered results

  const loadProperties = useCallback(async () => {
    const fetchedProperties = await fetchProperties();
    const parsedProperties = fetchedProperties.map((property) => {
      const imageUrl = property.images.length > 0 ? property.images[0] : "";
      return {
        ...property,
        image: imageUrl,
        price: ethers.utils.formatEther(property.price), // Format price for display
      };
    });
    setProperties(parsedProperties);
  }, []); // Add fetchProperties to dependencies

  useEffect(() => {
    loadProperties();
  }, [loadProperties]); // Load properties on mount

  useEffect(() => {
    // Filter properties based on search term
    const results = properties.filter((property) => {
      const searchableText = `${property.propertyTitle} ${property.category} ${property.price}`.toLowerCase();
      return searchableText.includes(searchTerm.toLowerCase());
    });

    setFilteredProperties(results);
  }, [searchTerm, properties]); // Update filtered properties when search term or properties change

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Banner Image */}
      <div className="flex justify-center items-center w-full h-[60vh]">
        <img src={banner} className="w-full sm:w-4/5 h-auto rounded-lg shadow-md" alt="Banner" />
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search properties..."
          className="w-full p-3 rounded-lg shadow-md"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Featured Properties Section */}
      <div className="p-6 font-bold text-4xl text-center">
        <h1>Featured Properties</h1>

        {/* Grid Layout for Properties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {(filteredProperties.length > 0 ? filteredProperties : properties).map((property, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={property.image}
                alt={`Property Image ${index + 1}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{property.propertyTitle}</h2>
                <p className="text-gray-600">{property.category}</p>
                <p className="text-lg font-bold">{property.price} ETH</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;