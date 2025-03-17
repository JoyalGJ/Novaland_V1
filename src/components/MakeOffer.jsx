import { useState, useEffect } from "react";
import { useAddress, useMetamask } from "@thirdweb-dev/react";
import { useLocation, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { ethers } from "ethers";
import contractABI from "../../contractABI.json";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { motion } from "framer-motion";

const supabaseUrl = "https://kogvbpflziyhhdunpkty.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvZ3ZicGZseml5aGhkdW5wa3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MzEyNTQsImV4cCI6MjA1NzEwNzI1NH0.9YNHdz5TzmL3nFsQbGl6WBEIkTaP3q5bn4-hplpziWQ";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
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

function MakeOffer() {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const state = location.state || {};
  const propertyId = state.propertyId ?? "";
  const { buyerWallet, sellerWallet } = state;

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const contract = await loadContract();
        if (!contract) throw new Error("Failed to load contract.");

        console.log("Fetching property for ID:", propertyId);

        const propertyData = await contract.FetchProperty(propertyId);
        console.log("Fetched property data:", propertyData);

        if (propertyData) {
          setProperty({
            productID: propertyData.productID.toNumber(),
            propertyTitle: propertyData.propertyTitle,
            price: propertyData.price.toNumber(),
            images: propertyData.images || [],
          });
        } else {
          throw new Error("No property data found.");
        }
      } catch (err) {
        console.error("Error fetching property data:", err);
        setError(err.message || "Failed to fetch property.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address) {
      alert("Please connect your wallet before submitting an offer.");
      await connectWithMetamask();
      return;
    }

    try {
      const { data: existingThread } = await supabase
        .from("threads")
        .select("id")
        .eq("buyer_wallet", address)
        .eq("seller_wallet", sellerWallet)
        .eq("property_id", propertyId)
        .single();

      let threadId = existingThread ? existingThread.id : null;

      if (!existingThread) {
        const { data: newThread, error: threadInsertError } = await supabase
          .from("threads")
          .insert([
            {
              buyer_wallet: address,
              seller_wallet: sellerWallet,
              property_id: propertyId,
            },
          ])
          .select("id")
          .single();

        if (threadInsertError) throw threadInsertError;
        threadId = newThread.id;
      }

      const { error: messageInsertError } = await supabase
        .from("messages")
        .insert([
          {
            thread_id: threadId,
            sender_wallet: address,
            message: message || "No message provided",
            price: parseFloat(price),
            type: "offer",
            status: "pending",
          },
        ]);

      if (messageInsertError) throw messageInsertError;

      navigate("/explore", {
        state: { buyerWallet: address, sellerWallet, propertyId },
      });
    } catch (err) {
      console.error("Error submitting offer:", err.message);
      alert("Failed to submit offer. Please try again.");
    }
  };

  return (
    <motion.div 
  className="p-10 max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 relative overflow-hidden"
  initial={{ opacity: 0 }} 
  animate={{ opacity: 1 }} 
  transition={{ duration: 0.5 }}
>

  {/* Subtle Background Pattern */}
  <div className="absolute inset-0 bg-gray-100 opacity-40 [mask-image:radial-gradient(circle,white,transparent)]"></div>

  {property ? (
    <motion.div 
      initial={{ y: -20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      <Card className="mb-8 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-white relative z-10">
        <img 
          src={property.images[0]} 
          alt={property.propertyTitle} 
          className="w-full h-72 object-cover rounded-t-2xl"
        />
        <CardContent className="p-6">
          <h3 className="text-3xl font-semibold mb-2 text-gray-900">{property.propertyTitle}</h3>
          <p className="text-lg text-gray-600">
            Price: <span className="font-semibold text-black">{property.price?.toLocaleString()} ETH</span>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  ) : (
    <p className="text-center text-gray-500 relative z-10">No property details found.</p>
  )}

  <h1 
    className="text-4xl font-bold text-center text-gray-900 mb-6 relative z-10 opacity-90"
  >
    Make an Offer
  </h1>

  <motion.form 
    onSubmit={handleSubmit} 
    className="space-y-6 bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 relative z-10"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.5 }}
  >
    {address && (
      <p className="text-sm text-gray-600">
        Connected Wallet: <span className="font-bold text-black">{address}</span>
      </p>
    )}

    {/* Offer Price Input */}
    <div>
      <label className="block font-medium text-gray-800 mb-1">Offer Price (ETH):</label>
      <Input 
        type="number" 
        step="0.01" 
        value={price} 
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          setPrice(value >= 0 ? value : "");
        }}
        placeholder="Enter your offer" 
        required 
        className="border-gray-300 focus:ring-gray-900 focus:border-black p-3 rounded-lg shadow-sm transition-all duration-300"
      />
    </div>

    {/* Message Input */}
    <div>
      <label className="block font-medium text-gray-800 mb-1">Message:</label>
      <Textarea 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="Add a message (optional)" 
        className="border-gray-300 focus:ring-gray-900 focus:border-black p-3 rounded-lg shadow-sm transition-all duration-300"
      />
    </div>

    {/* Submit Button */}
    <motion.button 
      type="submit" 
      className="bg-black w-full hover:bg-gray-800 text-white py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Submit Offer
    </motion.button>
  </motion.form>
</motion.div>
  );
}

export default MakeOffer;
