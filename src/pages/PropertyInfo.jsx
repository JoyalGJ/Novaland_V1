import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ethers } from "ethers";
import contractABI from "./../../contractABI.json";
import { supabase } from "../../supabase";

const contractAddress = "0x3d36F275F55cF1121eC6cA6C325954BdD3a9c868";

async function loadContract() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  } catch (error) {
    console.error("Error loading contract:", error);
    return null;
  }
}

function PropertyInfo() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOfferPending, setIsOfferPending] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);

      try {
        const contract = await loadContract();
        if (!contract) throw new Error("Contract not loaded.");
        const propertyId = ethers.BigNumber.from(id);
        const propertyData = await contract.FetchProperty(propertyId);

        setProperty({
          productID: propertyData.productID.toNumber(),
          owner: propertyData.owner,
          price: propertyData.price.toNumber(),
          propertyTitle: propertyData.propertyTitle,
          category: propertyData.category,
          images: propertyData.images,
          propertyAddress: propertyData.propertyAddress,
          description: propertyData.description,
          nftId: propertyData.nftId,
        });

        await checkOfferStatus(propertyData.productID.toNumber());
      } catch (err) {
        console.error("Error fetching property:", err);
        setError(err.message || "Failed to fetch property.");
      } finally {
        setLoading(false);
      }
    };

    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking wallet:", error);
        }
      } else {
        console.warn("MetaMask not detected.");
      }
    };

    fetchProperty();
    checkWalletConnection();
  }, [id]);

  const checkOfferStatus = async (propertyId) => {
    try {
      const { data, error } = await supabase
        .from("threads")
        .select("status")
        .eq("property_id", propertyId)
        .eq("status", "open");

      if (error) throw error;
      setIsOfferPending(data.length > 0); // true if at least one open offer exists
    } catch (err) {
      console.error("Error checking offer status:", err.message);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask not detected. Please install it.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="relative min-h-screen text-gray-900">
      <div className="p-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">{property?.propertyTitle}</h1>
        <div className="flex flex-wrap gap-6 justify-between mb-8">
          <div className="w-full lg:w-1/2">
            <Slider dots infinite speed={500} slidesToShow={1} slidesToScroll={1} autoplay autoplaySpeed={3000}>
              {Array.isArray(property?.images)
                ? property.images.map((image, index) => (
                    <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                      <img src={image} alt={`Property Image ${index + 1}`} className="w-full h-96 object-cover" />
                    </div>
                  ))
                : <div>No images available</div>}
            </Slider>
          </div>

          <div className="w-full lg:w-4/10 bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="text-xl font-semibold border-b border-gray-300 pb-2 mb-4">{property?.propertyAddress}</div>
            <div className="text-3xl font-bold text-green-600 mb-4">₹{property?.price?.toLocaleString()}</div>
            <div className="text-lg space-y-2">
              <p><strong>Type:</strong> {property?.category}</p>
              <p><strong>Description:</strong> {property?.description}</p>

              {walletAddress ? (
                <Link
                to="/make-offer"
                state={{
                  buyerWallet: walletAddress ?? "",
                  sellerWallet: property?.owner ?? "",
                  propertyId: property?.productID ?? "", // Ensure 0 isn't overridden
                }}
                className={`px-6 py-3 mt-4 rounded-lg ${
                  isOfferPending ? "bg-yellow-500 cursor-not-allowed" : "bg-indigo-600 text-white"
                }`}
                style={isOfferPending ? { pointerEvents: "none" } : {}}
                onClick={(e) => {
                  console.log("Sending to MakeOffer:", {
                    buyerWallet: walletAddress,
                    sellerWallet: property?.owner,
                    propertyId: property?.productID,
                  });
                  if (!walletAddress || isOfferPending) {
                    e.preventDefault(); // Prevent navigation if offer is pending or no wallet
                  }
                }}
              >
                {isOfferPending ? "Offer Pending" : "Make Offer"}
              </Link>              
              ) : (
                <button
                  onClick={connectWallet}
                  className="px-6 py-3 mt-4 bg-yellow-500 text-white rounded-lg"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyInfo;
