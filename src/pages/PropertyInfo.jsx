import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ethers } from "ethers";
import contractABI from "./../../contractABI.json";

const contractAddress = "0x3d36F275F55cF1121eC6cA6C325954BdD3a9c868";

async function loadContract() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    return contract;
  } catch (error) {
    console.error("Error loading contract:", error);
    return null;  // Return null in case of error
  }
}

function PropertyInfo() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);  // Reset error state

      try {
        const contract = await loadContract();
        if (!contract) {
          throw new Error("Contract not loaded properly. Check your provider.");
        }

        // Convert id to a BigNumber
        const propertyId = ethers.BigNumber.from(id);

        const propertyData = await contract.FetchProperty(propertyId);

        // Correctly format property data
        setProperty({
          productID: propertyData.productID.toNumber(),
          owner: propertyData.owner,
          price: propertyData.price.toNumber(),
          propertyTitle: propertyData.propertyTitle,
          category: propertyData.category,
          images: propertyData.images,
          propertyAddress: propertyData.propertyAddress,
          description: propertyData.description,
          nftId: propertyData.nftId
        });
      } catch (err) {
        console.error("Error fetching property:", err);
        setError(err.message || "Failed to fetch property.");  // Set error message
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    } else {
      setLoading(false); // Set loading to false if no ID is present.
      setError("No property ID provided."); // Set error if ID is missing.
    }

  }, [id]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  if (!property) return <div>Property not found.</div>;

  return (
    <div className="relative min-h-screen text-gray-900">
      <div className="p-10 max-w-6xl mx-auto z-20">
        <h1 className="text-4xl font-bold text-center mb-6 animate-fadeIn">{property.propertyTitle}</h1>
        <div className="flex flex-wrap gap-6 justify-between mb-8 animate-slideIn">
          <div className="w-full lg:w-1/2">
            <Slider {...sliderSettings}>
              {Array.isArray(property.images) ? property.images.map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={image}
                    alt={`Property Image ${index + 1}`}
                    className="w-full h-96 object-cover"
                  />
                </div>
              )) : <div>No images available</div>}
            </Slider>
          </div>

          <div className="w-full lg:w-4/10 bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="text-xl font-semibold border-b border-gray-300 pb-2 mb-4">{property.propertyAddress}</div>
            <div className="text-3xl font-bold text-green-600 mb-4">₹{property.price.toLocaleString()}</div>
            <div className="text-lg space-y-2">
              <p><strong>Type:</strong> {property.category}</p>
              <p><strong>Description:</strong> {property.description}</p>
              <motion.button
                className="px-6 py-3 mt-4 bg-indigo-600 text-white rounded-lg shadow-md text-lg font-semibold hover:bg-indigo-700 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Make Offer
              </motion.button>
            </div>
          </div>
        </div>
        {/* Additional sections for landmarks, owner details, etc. */}
      </div>
    </div>
  );
}

export default PropertyInfo;