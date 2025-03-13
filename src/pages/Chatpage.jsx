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
      <aside className="w-1/3 border-r p-4 overflow-y-auto bg-white">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setViewAsBuyer(true)}
            className={`p-2 rounded ${
              viewAsBuyer ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            View as Buyer
          </button>
          <button
            onClick={() => setViewAsBuyer(false)}
            className={`p-2 rounded ${
              !viewAsBuyer ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            View as Seller
          </button>
        </div>

        {loadingThreads ? (
          <p>Loading threads...</p>
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
                className={`p-4 cursor-pointer border-b ${
                  thread.status === "closed"
                    ? "bg-gray-300 text-gray-500"
                    : activeThread?.id === thread.id
                    ? "bg-blue-100"
                    : ""
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
      </aside>

      {/* Messages Panel */}
      <div className="w-2/3 p-4">
        {activeThread ? (
          <>
            <div className="border-b p-2 font-bold bg-white">
              {getThreadTitle(activeThread)}
            </div>

            <div className="h-96 overflow-y-auto p-4 bg-white">
              {loadingMessages ? (
                <p>Loading messages...</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-2 p-2 rounded ${
                      msg.sender_wallet === connectedWallet
                        ? "bg-blue-200 ml-auto"
                        : "bg-gray-200 mr-auto"
                    }`}
                  >
                    {msg.message}
                  </div>
                ))
              )}
            </div>

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full p-2 border rounded mt-2"
            />
            <button
              onClick={handleSendMessage}
              className="mt-2 p-2 bg-blue-500 text-white rounded"
            >
              Send
            </button>

            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              placeholder="Offer Price (ETH)"
              className="w-full p-2 border rounded mt-2"
            />
            <button
              onClick={handleMakeOffer}
              className="mt-2 p-2 bg-green-500 text-white rounded"
            >
              Make Offer
            </button>
          </>
        ) : (
          <p className="text-gray-600">Select a thread to view messages.</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
