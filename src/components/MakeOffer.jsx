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
    <motion.div className="p-12 max-w-3xl mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {property ? (
        <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 100 }}>
          <Card className="mb-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg">
            <img src={property.images[0]} alt={property.propertyTitle} className="w-full h-72 object-cover rounded-t-lg" />
            <CardContent className="p-6">
              <h3 className="text-4xl font-extrabold mb-3 text-blue-800">{property.propertyTitle}</h3>
              <p className="text-lg text-gray-700 mb-4">Price: <span className="font-bold text-blue-600">₹{property.price?.toLocaleString()}</span></p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <p className="text-center text-gray-500">No property details found.</p>
      )}
      <h1 className="text-5xl font-bold mb-8 text-center text-blue-900">Make an Offer</h1>
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        {address && (
          <p className="text-sm text-gray-600">Connected Wallet: <span className="font-bold text-blue-800">{address}</span></p>
        )}
        <div>
          <label className="block font-medium text-blue-900">Offer Price (ETH):</label>
          <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter offer price" required className="border-blue-400 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block font-medium text-blue-900">Message:</label>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Add a message (optional)" className="border-blue-400 focus:ring-blue-500" />
        </div>
        <Button type="submit" className="bg-blue-600 w-full hover:bg-blue-700 text-white rounded-lg">Submit Offer</Button>
      </form>
    </motion.div>
  );
}

export default MakeOffer;
