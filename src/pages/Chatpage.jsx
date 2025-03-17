import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { supabase } from "../../supabase";

const ChatPage = () => {
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [connectedWallet, setConnectedWallet] = useState("");
  const [viewAsBuyer, setViewAsBuyer] = useState(true);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Connect to MetaMask and get wallet address
  useEffect(() => {
    async function connectWallet() {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.send("eth_requestAccounts", []);
          const walletAddress = accounts[0];
          console.log("Connected wallet:", walletAddress);
          setConnectedWallet(walletAddress);
        } catch (err) {
          console.error("Error connecting to MetaMask:", err);
        }
      } else {
        console.error("MetaMask not found.");
      }
    }
    connectWallet();
  }, []);

  // Fetch threads where the user is either buyer or seller
  const fetchThreads = useCallback(async () => {
    if (!connectedWallet) return;

    setLoadingThreads(true);

    const { data, error } = await supabase
      .from("threads")
      .select("*")
      .or(
        `buyer_wallet.eq.${connectedWallet},seller_wallet.eq.${connectedWallet}`
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching threads:", error);
    } else {
      console.log("Threads fetched:", data);
      setThreads(data || []);
    }

    setLoadingThreads(false);
  }, [connectedWallet]);

  // Fetch messages for a selected thread
  const fetchMessages = useCallback(async (threadId) => {
    setLoadingMessages(true);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      console.log("Messages fetched:", data);
      setMessages(data || []);
    }

    setLoadingMessages(false);
  }, []);

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage || !activeThread) return;

    const { error } = await supabase.from("messages").insert({
      thread_id: activeThread.id,
      sender_wallet: connectedWallet,
      message: newMessage,
      type: "message",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error sending message:", error);
    } else {
      fetchMessages(activeThread.id); // Refresh messages
    }

    setNewMessage("");
  };

  // Make an offer
  const handleMakeOffer = async () => {
    if (!offerPrice || !activeThread) return;

    const { error } = await supabase.from("messages").insert({
      thread_id: activeThread.id,
      sender_wallet: connectedWallet,
      message: `Offer: ${offerPrice} ETH`,
      price: parseFloat(offerPrice),
      type: "offer",
      status: "pending",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error making offer:", error);
    } else {
      fetchMessages(activeThread.id); // Refresh messages
    }

    setOfferPrice("");
  };

  // Get thread title (show other user's wallet and property ID)
  const getThreadTitle = (thread) => {
    const isBuyer = thread.buyer_wallet === connectedWallet;
    const otherWallet = isBuyer ? thread.seller_wallet : thread.buyer_wallet;
    const userRole = isBuyer ? "Buyer" : "Seller";
    return `Property: ${thread.property_id} — ${otherWallet} (${userRole})`;
  };

  useEffect(() => {
    if (connectedWallet) {
      fetchThreads();
    }
  }, [fetchThreads, connectedWallet]);

  return (
    <div className="flex h-screen bg-gray-100">
  {/* Sidebar for Threads */}
  <aside className="w-1/3 border-r p-4 bg-white flex flex-col">
    {/* Buyer/Seller Toggle */}
    <div className="flex justify-between mb-4">
      <button
        onClick={() => setViewAsBuyer(true)}
        className={`p-2 rounded-full font-medium transition-all ${
          viewAsBuyer ? "bg-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-700"
        }`}
      >
        View as Buyer
      </button>
      <button
        onClick={() => setViewAsBuyer(false)}
        className={`p-2 rounded-full font-medium transition-all ${
          !viewAsBuyer ? "bg-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-700"
        }`}
      >
        View as Seller
      </button>
    </div>

    {/* Threads List */}
    <div className="flex-1 overflow-y-auto">
      {loadingThreads ? (
        <p className="text-center text-gray-500">Loading threads...</p>
      ) : (
        threads
          .filter((thread) =>
            viewAsBuyer
              ? thread.buyer_wallet === connectedWallet
              : thread.seller_wallet === connectedWallet
          )
          .map((thread) => (
            <div
              key={thread.id}
              className={`p-4 cursor-pointer rounded-lg mb-2 transition-all ${
                thread.status === "closed"
                  ? "bg-gray-300 text-gray-500"
                  : activeThread?.id === thread.id
                  ? "bg-blue-100 border-l-4 border-blue-600 shadow-md"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => {
                setActiveThread(thread);
                fetchMessages(thread.id);
              }}
            >
              {getThreadTitle(thread)}
            </div>
          ))
      )}
    </div>
  </aside>

  {/* Chat Messages Panel */}
  <div className="w-2/3 flex flex-col bg-white">
    {activeThread ? (
      <>
        {/* Chat Header */}
        <div className="border-b p-4 font-semibold text-lg bg-gray-50 shadow-sm">
          {getThreadTitle(activeThread)}
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loadingMessages ? (
            <p className="text-center text-gray-500">Loading messages...</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-xs px-4 py-2 rounded-lg text-sm shadow-md ${
                  msg.sender_wallet === connectedWallet
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-gray-900 mr-auto"
                }`}
              >
                {msg.message}
              </div>
            ))
          )}
        </div>

        {/* Chat Input Section */}
        <div className="border-t p-4 bg-gray-50 flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="p-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all"
          >
            ➤
          </button>
        </div>

        {/* Offer Input Section */}
        <div className="border-t p-4 bg-gray-50 flex items-center space-x-2">
          <input
            type="number"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            placeholder="Offer Price (ETH)"
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleMakeOffer}
            className="p-3 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition-all"
          >
            💰
          </button>
        </div>
      </>
    ) : (
      <p className="text-center text-gray-600 mt-20">Select a thread to start chatting.</p>
    )}
  </div>
</div>

  );
};

export default ChatPage;
