import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { supabase } from "../../supabase";
import moment from "moment";
import contractABI from "../../contractABI.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faGift, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const CONTRACT_ADDRESS = "0x3d36F275F55cF1121eC6cA6C325954BdD3a9c868";

const fetchPropertyFromBlockchain = async (propertyId, provider, contract) => {
    try {
        const property = await contract.FetchProperty(propertyId);
        return {
            productID: Number(property.productID),
            owner: property.owner,
            price: Number(property.price),
            propertyTitle: property.propertyTitle,
            category: property.category,
            images: property.images,
            propertyAddress: property.propertyAddress,
            description: property.description,
            nftId: property.nftId
        };
    } catch (error) {
        console.error("Error fetching property:", error);
        return null;
    }
};


function ChatPage() {
    const [threads, setThreads] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeThread, setActiveThread] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [offerPrice, setOfferPrice] = useState("");
    const [offerMessage, setOfferMessage] = useState("");
    const [connectedWallet, setConnectedWallet] = useState("");
    const [userNames, setUserNames] = useState({});
    const [isOfferPending, setIsOfferPending] = useState(false);
    const [propertyNames, setPropertyNames] = useState({});
    const [allPropertiesMap, setAllPropertiesMap] = useState({});
    const [propertiesLoading, setPropertiesLoading] = useState(false);
    const [isOfferFormVisible, setIsOfferFormVisible] = useState(false);
    const [isBuyerView, setIsBuyerView] = useState(true);
    const [error, setError] = useState(null);
    const [unreadThreads, setUnreadThreads] = useState({});

    function clearError() {
        setError(null);
    }

    const connectWallet = useCallback(async function connectWalletHandler() {
        clearError();
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const account = await signer.getAddress();
                setConnectedWallet(account.toLowerCase());
            } catch (err) {
                console.error("Error connecting wallet:", err);
                setError("Failed to connect wallet.");
            }
        } else {
            console.error("MetaMask not found.");
            setError("MetaMask not found. Please install MetaMask.");
        }
    }, []);

    const fetchUserNames = useCallback(async function fetchUserNamesHandler(wallets) {
        const uniqueWallets = [...new Set(wallets)].filter(Boolean).filter(w => !userNames[w]);
        if (uniqueWallets.length === 0) return;
        try {
            const { data, error: fetchError } = await supabase.from("users").select("wallet_address, name").in("wallet_address", uniqueWallets);
            if (fetchError) {
                console.error("Error fetching user names:", fetchError);
                setError("Failed to fetch user details.");
                return;
            }
            const nameMap = data.reduce((acc, user) => {
                acc[user.wallet_address] = user.name || `${user.wallet_address.substring(0, 6)}...${user.wallet_address.slice(-4)}`;
                return acc;
            }, {});
            setUserNames(prev => ({ ...prev, ...nameMap }));
        } catch (err) {
            console.error("Error in fetchUserNames:", err);
            setError("An error occurred fetching user details.");
        }
    }, [userNames]);

    const fetchAllPropertiesFromContract = useCallback(async function fetchAllPropertiesHandler() {
        if (propertiesLoading || Object.keys(allPropertiesMap).length > 0 || !window.ethereum) return;
        setPropertiesLoading(true);
        clearError();
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
            const properties = await contract.FetchProperties();
            const propMap = properties.reduce((map, prop) => {
                 const propertyId = Number(prop.productID);
                 if (propertyId !== undefined) {
                     map[propertyId] = {
                         productID: propertyId,
                         owner: prop.owner,
                         price: Number(prop.price),
                         propertyTitle: prop.propertyTitle || "Unnamed Property",
                         category: prop.category,
                         images: prop.images,
                         propertyAddress: prop.propertyAddress,
                         description: prop.description,
                         nftId: prop.nftId
                     };
                 }
                 return map;
            }, {});
            setAllPropertiesMap(propMap);
        } catch (err) {
            console.error("Error fetching properties from contract:", err);
            setError("Failed to fetch property details. Titles may be missing.");
            setAllPropertiesMap({});
        } finally {
            setPropertiesLoading(false);
        }
    }, [propertiesLoading, allPropertiesMap]);

    const fetchThreads = useCallback(async function fetchThreadsHandler() {
        if (!connectedWallet) return;
        clearError();
        try {
            const { data, error: fetchError } = await supabase.from("threads").select("*").or(`buyer_wallet.eq.${connectedWallet},seller_wallet.eq.${connectedWallet}`).order("created_at", { ascending: false });
            if (fetchError) {
                console.error("Error fetching threads:", fetchError);
                setError("Failed to load conversations.");
                return;
            }
            const fetchedThreads = data || [];
            setThreads(fetchedThreads);
            if (fetchedThreads.length > 0) {
                const wallets = fetchedThreads.flatMap(t => [t.buyer_wallet, t.seller_wallet]);
                fetchUserNames(wallets);
            }
        } catch (err) {
            console.error("Error in fetchThreads:", err);
            setError("An error occurred loading conversations.");
        }
    }, [connectedWallet, fetchUserNames]);

    const fetchMessages = useCallback(async function fetchMessagesHandler(threadId) {
        if (!threadId) return;
        try {
            const { data, error: fetchError } = await supabase.from("messages").select("*").eq("thread_id", threadId).order("created_at", { ascending: true });
            if (fetchError) {
                console.error("Error fetching messages:", fetchError);
                setError("Failed to load messages.");
                return;
            }
            const sortedMessages = data ? [...data].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) : [];
            setMessages(sortedMessages);
            const userHasPendingOffer = sortedMessages.some(msg => msg.type === "offer" && msg.status === "pending" && msg.sender_wallet === connectedWallet);
            setIsOfferPending(userHasPendingOffer);
            if (data?.length > 0) {
                 const wallets = data.map(msg => msg.sender_wallet);
                 fetchUserNames(wallets);
            }
        } catch (err) {
            console.error("Error in fetchMessages:", err);
            setError("An error occurred loading messages.");
        }
    }, [connectedWallet, fetchUserNames]);

    const markMessagesAsRead = useCallback(async function markMessagesAsReadHandler(threadId) {
        if (!threadId || !connectedWallet) return;
        setUnreadThreads(prev => {
            const newState = { ...prev };
            delete newState[threadId];
            return newState;
        });
        try {
            const { data: unreadMessages, error: unreadError } = await supabase.from("messages").select('id').eq('thread_id', threadId).neq('sender_wallet', connectedWallet).is('read', null);
            if (unreadError) {
                console.error('Error fetching unread count:', unreadError);
                return;
            }
            if (unreadMessages && unreadMessages.length > 0) {
                const messageIds = unreadMessages.map(msg => msg.id);
                const { error: updateError } = await supabase.from("messages").update({ read: true }).in('id', messageIds);
                if (updateError) {
                    console.error('Error marking messages as read:', updateError);
                }
            }
        } catch (err) {
            console.error('Error in markMessagesAsRead:', err);
        }
    }, [connectedWallet]);

    const getThreadName = useCallback(function getThreadNameHandler(thread) {
        if (!thread || !connectedWallet) return "Unknown";
        const otherWallet = thread.buyer_wallet === connectedWallet ? thread.seller_wallet : thread.buyer_wallet;
        return userNames[otherWallet] || `${otherWallet?.substring(0, 6)}...${otherWallet?.slice(-4)}`;
    }, [connectedWallet, userNames]);

    const isThreadUnread = useCallback(function isThreadUnreadHandler(thread) {
        return !!unreadThreads[thread.id];
    }, [unreadThreads]);

    const determineThreadStyle = useCallback(function determineThreadStyleHandler(thread) {
        if (activeThread?.id === thread.id) {
            return 'bg-blue-100';
        } else if (thread.status === "closed") {
            return 'bg-gray-100 text-gray-500 hover:bg-gray-200';
        } else {
            return 'hover:bg-gray-100';
        }
    }, [activeThread]);

    const getFilteredThreads = useCallback(function getFilteredThreadsHandler() {
        return threads.filter(thread => {
            if (isBuyerView) {
                return thread.buyer_wallet === connectedWallet;
            } else {
                return thread.seller_wallet === connectedWallet;
            }
        });
    }, [threads, isBuyerView, connectedWallet]);

    useEffect(() => {
        connectWallet();
    }, [connectWallet]);

    useEffect(() => {
        if (connectedWallet) {
            fetchAllPropertiesFromContract();
            fetchThreads();
        } else {
            setThreads([]);
            setActiveThread(null);
            setMessages([]);
            setUserNames({});
            setPropertyNames({});
            setAllPropertiesMap({});
            setPropertiesLoading(false);
            setUnreadThreads({});
            setError(null);
            setIsBuyerView(true);
        }
    }, [connectedWallet, fetchThreads, fetchAllPropertiesFromContract]);

    useEffect(() => {
        const mapIsReady = Object.keys(allPropertiesMap).length > 0;

        if (threads.length > 0 && (mapIsReady || !propertiesLoading)) {
            const newPropertyNames = {};
            const missingPropertyIds = [];

            threads.forEach(thread => {
                const propertyId = thread.property_id;

                if (propertyId !== undefined && allPropertiesMap[propertyId]) {
                    newPropertyNames[thread.id] = allPropertiesMap[propertyId].propertyTitle;
                } else {
                    newPropertyNames[thread.id] = propertiesLoading ? "Loading..." : "Unknown Property";
                     if (propertyId !== undefined && !allPropertiesMap[propertyId] && !propertiesLoading) {
                        missingPropertyIds.push(propertyId);
                    }
                }
            });

            if (JSON.stringify(newPropertyNames) !== JSON.stringify(propertyNames)) {
                setPropertyNames(newPropertyNames);
            }

            const uniqueMissingIds = [...new Set(missingPropertyIds)];
            if (uniqueMissingIds.length > 0 && window.ethereum) {
                (async () => {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

                    const fetchedProperties = {};
                    for (const propertyId of uniqueMissingIds) {
                        const propertyData = await fetchPropertyFromBlockchain(propertyId, provider, contract);
                        if (propertyData) {
                            fetchedProperties[propertyId] = propertyData;
                        }
                    }

                    if (Object.keys(fetchedProperties).length > 0) {
                        setAllPropertiesMap(prev => ({
                            ...prev,
                            ...fetchedProperties
                        }));
                    }
                })();
            }
        } else if (threads.length > 0 && propertiesLoading) {
            setPropertyNames(prev => {
                const needsUpdate = threads.some(thread => !prev[thread.id] || prev[thread.id] !== "Loading...");
                if (!needsUpdate) return prev;

                const newPropertyNames = { ...prev };
                threads.forEach(thread => {
                    if (!newPropertyNames[thread.id]) {
                        newPropertyNames[thread.id] = "Loading...";
                    }
                });
                return newPropertyNames;
            });
        }
    }, [threads, allPropertiesMap, propertiesLoading, propertyNames, setAllPropertiesMap, setPropertyNames]);

    useEffect(() => {
        if (activeThread) {
            fetchMessages(activeThread.id);
            markMessagesAsRead(activeThread.id);
        } else {
            setMessages([]);
        }
    }, [activeThread, fetchMessages, markMessagesAsRead]);

    useEffect(() => {
        if (!connectedWallet) return;
        const threadsChannel = supabase.channel(`public:threads:user=${connectedWallet}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: "threads" }, (payload) => {
                 const changedThread = payload.new || payload.old;
                 if (changedThread && (changedThread.buyer_wallet === connectedWallet || changedThread.seller_wallet === connectedWallet)) {
                     fetchThreads();
                 }
             }).subscribe((status, err) => {
                 if (err) { console.error("Error subscribing to threads:", err); setError("Connection issue: Real-time conversation updates unavailable."); }
            });
        const messagesChannel = supabase.channel(`public:messages`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: "messages" }, (payload) => {
                const newMessage = payload.new;
                if (newMessage.sender_wallet === connectedWallet) return;
                if (activeThread && newMessage.thread_id === activeThread.id) {
                    fetchMessages(activeThread.id);
                    markMessagesAsRead(activeThread.id);
                } else {
                    setUnreadThreads(prev => ({ ...prev, [newMessage.thread_id]: true }));
                    fetchThreads(); // Fetch threads to potentially update counts or status implicitly shown in sidebar
                }
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: "messages" }, (payload) => {
                 const updatedMessage = payload.new;
                 if (activeThread && updatedMessage.thread_id === activeThread.id) {
                      fetchMessages(activeThread.id);
                 }
                 // Also potentially update thread list if status changed, e.g., offer accepted/rejected
                 if (updatedMessage.type === 'offer' && (updatedMessage.status === 'accepted' || updatedMessage.status === 'rejected')) {
                     fetchThreads();
                 }
             }).subscribe((status, err) => {
                 if (err) { console.error("Error subscribing to messages:", err); setError("Connection issue: Real-time message updates unavailable."); }
             });
        return () => {
            supabase.removeChannel(threadsChannel);
            supabase.removeChannel(messagesChannel);
        };
    }, [connectedWallet, activeThread, fetchMessages, fetchThreads, markMessagesAsRead]);


    const handleSendMessage = useCallback(async function handleSendMessageHandler() {
        if (!newMessage.trim() || !activeThread || activeThread.status === "closed") return;
        clearError();
        const tempMessage = newMessage;
        setNewMessage("");
        try {
            const { error: insertError } = await supabase.from("messages").insert({
                thread_id: activeThread.id,
                sender_wallet: connectedWallet,
                message: tempMessage,
                type: "message",
                read: null
            });
            if (insertError) {
                console.error("Error sending message:", insertError);
                setError("Failed to send message.");
                setNewMessage(tempMessage);
            }
        } catch (err) {
            console.error("Error sending message:", err);
            setError("An unexpected error occurred sending the message.");
            setNewMessage(tempMessage);
        }
    }, [newMessage, activeThread, connectedWallet]);

    const handleMakeOffer = useCallback(async function handleMakeOfferHandler() {
        if (!offerPrice || !activeThread || activeThread.status === "closed" || isOfferPending) {
            if (isOfferPending) setError("You already have an offer pending in this conversation.");
            return;
        }
        clearError();
        const price = parseFloat(offerPrice);
        if (isNaN(price) || price <= 0) {
            setError("Please enter a valid positive offer price.");
            return;
        }
        const tempOfferPrice = offerPrice;
        const tempOfferMessage = offerMessage;
        setIsOfferFormVisible(false);
        setOfferPrice("");
        setOfferMessage("");
        try {
            const { error: insertError } = await supabase.from("messages").insert({
                thread_id: activeThread.id,
                sender_wallet: connectedWallet,
                message: tempOfferMessage,
                price: price,
                type: "offer",
                status: "pending",
                read: null
            });
            if (insertError) {
                console.error("Error making offer:", insertError);
                setError("Failed to submit offer.");
                setIsOfferFormVisible(true);
                setOfferPrice(tempOfferPrice);
                setOfferMessage(tempOfferMessage);
                return;
            }
            setIsOfferPending(true);
        } catch (err) {
            console.error("Error making offer:", err);
            setError("An unexpected error occurred submitting the offer.");
            setIsOfferFormVisible(true);
            setOfferPrice(tempOfferPrice);
            setOfferMessage(tempOfferMessage);
        }
    }, [offerPrice, offerMessage, activeThread, isOfferPending, connectedWallet]);

    const handleAcceptOffer = useCallback(async function handleAcceptOfferHandler(offerMessage) {
        if (!activeThread || activeThread.status === "closed" || offerMessage.sender_wallet === connectedWallet) return;
        clearError();
        try {
            const { error: updateMsgError } = await supabase.from("messages").update({ status: "accepted" }).eq("id", offerMessage.id).neq('sender_wallet', connectedWallet);
            if (updateMsgError) {
                console.error("Error accepting offer (message update):", updateMsgError);
                setError("Failed to update offer status.");
                return;
            }
            const { error: updateThreadError } = await supabase.from("threads").update({ status: "closed" }).eq("id", activeThread.id);
            if (updateThreadError) {
                console.error("Error accepting offer (thread update):", updateThreadError);
                setError("Offer accepted, but failed to close the conversation status. Refetching lists.");
                fetchThreads();
                return;
            }
            setActiveThread(prev => prev ? ({ ...prev, status: "closed" }) : null);
            setIsOfferPending(false);
        } catch (err) {
            console.error("Error processing offer acceptance:", err);
            setError("An unexpected error occurred while accepting the offer.");
        }
    }, [activeThread, connectedWallet, fetchThreads]);

    const handleRejectOffer = useCallback(async function handleRejectOfferHandler(offerId) {
        if (!activeThread || activeThread.status === "closed") return;
        clearError();
        try {
            const { error: updateError } = await supabase.from("messages").update({ status: "rejected" }).eq("id", offerId).neq('sender_wallet', connectedWallet);
            if (updateError) {
                console.error("Error rejecting offer:", updateError);
                setError("Failed to reject offer.");
                return;
            }
             setIsOfferPending(false); // Allow user to make another offer if theirs was rejected
        } catch (err) {
            console.error("Error rejecting offer:", err);
            setError("An unexpected error occurred while rejecting the offer.");
        }
    }, [activeThread, connectedWallet]);

    return (
        <div className="flex h-screen bg-gray-50">
            <aside className="w-1/4 border-r p-4 bg-white shadow-md flex flex-col">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Conversations</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">View as:</label>
                    <div className="flex items-center">
                         <button className={`px-4 py-2 rounded-l-md transition-colors ${isBuyerView ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setIsBuyerView(true)}>Buyer</button>
                         <button className={`px-4 py-2 rounded-r-md transition-colors ${!isBuyerView ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setIsBuyerView(false)}>Seller</button>
                    </div>
                </div>
                <div className="space-y-3 overflow-y-auto flex-grow">
                    {getFilteredThreads().map((thread) => (
                        <div key={thread.id} className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200 ${determineThreadStyle(thread)} ${isThreadUnread(thread) ? "font-bold" : ""} hover:scale-[1.02] hover:shadow-md`}
                            onClick={() => { clearError(); setUnreadThreads(prev => { const newState = { ...prev }; delete newState[thread.id]; return newState; }); setActiveThread(thread); }}
                            style={{ transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out' }}>
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0"><span className="text-lg text-gray-700">👤</span></div>
                            <div className="flex-grow overflow-hidden">
                                <div className="text-lg font-medium text-gray-800 truncate">{getThreadName(thread)}</div>
                                <div className="text-sm text-gray-600 truncate">{propertyNames[thread.id] || 'Loading...'}</div>
                            </div>
                        </div>
                    ))}
                    {getFilteredThreads().length === 0 && !error && (<p className="text-center text-gray-500 mt-4">No conversations found for this view.</p>)}
                </div>
            </aside>
            <div className="w-3/4 flex flex-col bg-gray-50">
                 {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded relative m-4 shadow-md" role="alert">
                        <div className="flex justify-between items-center">
                            <div><strong className="font-bold block sm:inline">Error:</strong><span className="block sm:inline ml-2">{error}</span></div>
                            <button onClick={clearError} className="ml-4 text-red-500 hover:text-red-700 font-bold"><FontAwesomeIcon icon={faTimes} /></button>
                        </div>
                    </div>
                 )}
                {activeThread ? (
                    <>
                        <div className="border-b p-6 bg-white shadow-sm">
                            <h2 className="text-2xl font-semibold text-gray-800">Chat with {getThreadName(activeThread)}</h2>
                            <p className="text-gray-600">Property: {propertyNames[activeThread.id] || 'Loading...'}</p>
                        </div>
                        {activeThread.status === "closed" && messages.some(msg => msg.status === "accepted") && (
                            <div className="bg-green-500 text-white p-3 text-center font-semibold">OFFER ACCEPTED: {messages.find((msg) => msg.status === "accepted")?.price} ETH</div>
                        )}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender_wallet === connectedWallet ? 'justify-end' : 'justify-start'}`}>
                                     <div className={`max-w-lg lg:max-w-xl xl:max-w-2xl animate-fadeIn`} style={{ animationDuration: "0.3s" }}>
                                        {msg.type === "message" ? (
                                            <div className={`p-3 rounded-xl shadow-sm ${msg.sender_wallet === connectedWallet ? "bg-blue-600 text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"}`}>
                                                <p className="text-sm break-words">{msg.message}</p>
                                                <span className={`text-xs mt-1 block text-right ${msg.sender_wallet === connectedWallet ? 'text-blue-200' : 'text-gray-400'}`}>{moment(msg.created_at).fromNow()}</span>
                                            </div>
                                        ) : (
                                            <div className={`bg-white border rounded-lg shadow-md p-4 ${msg.sender_wallet === connectedWallet ? 'border-blue-200' : 'border-gray-200'}`}>
                                                <div className="mb-2"><span className="text-lg font-semibold text-gray-800">{msg.sender_wallet === connectedWallet ? 'Offer Sent:' : 'Offer Received:'} {msg.price} ETH</span></div>
                                                {msg.message && ( <p className="text-gray-700 text-sm mb-3">{msg.message}</p> )}
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-gray-500 text-xs">{moment(msg.created_at).fromNow()}</span>
                                                    {msg.status === "pending" && activeThread.status !== "closed" && msg.sender_wallet !== connectedWallet && (
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleAcceptOffer(msg)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline text-xs transition-colors duration-200"><FontAwesomeIcon icon={faCheck} className="mr-1" /> Accept</button>
                                                            <button onClick={() => handleRejectOffer(msg.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline text-xs transition-colors duration-200"><FontAwesomeIcon icon={faTimes} className="mr-1" /> Reject</button>
                                                        </div>
                                                    )}
                                                    {msg.status !== "pending" && (<span className={`text-sm font-semibold py-1 px-2 rounded ${msg.status === "accepted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}</span>)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-white border-t shadow-sm">
                            <div className="flex items-center gap-4">
                                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder={activeThread.status === "closed" ? "Conversation closed" : "Type a message..."}
                                    className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 disabled:bg-gray-100"
                                    onKeyDown={(e) => { if (e.key === 'Enter' && newMessage.trim() && activeThread.status !== "closed") { handleSendMessage(); } }} disabled={activeThread.status === "closed"}/>
                                <button onClick={handleSendMessage} className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-5 rounded-full focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center justify-center ${(activeThread.status === "closed" || !newMessage.trim()) ? "opacity-50 cursor-not-allowed" : ""}`} disabled={activeThread.status === "closed" || !newMessage.trim()}><FontAwesomeIcon icon={faPaperPlane} /></button>
                                <button onClick={() => setIsOfferFormVisible(!isOfferFormVisible)} className={`bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-5 rounded-full focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center justify-center ${(activeThread.status === "closed" || isOfferPending || isOfferFormVisible || activeThread.buyer_wallet !== connectedWallet ) ? "opacity-50 cursor-not-allowed" : ""}`} disabled={activeThread.status === "closed" || isOfferPending || isOfferFormVisible || activeThread.buyer_wallet !== connectedWallet } title={activeThread.buyer_wallet !== connectedWallet ? "Only buyer can make offers" : "Make Offer"}><FontAwesomeIcon icon={faGift} /></button>

                            </div>
                            {isOfferFormVisible && activeThread.buyer_wallet === connectedWallet && (
                                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-inner animate-fadeIn" style={{ animationDuration: "0.3s" }}>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Make an Offer</h3>
                                    <div className="mb-3">
                                        <label htmlFor="offerPrice" className="block text-gray-700 text-sm font-bold mb-1">Offer Price (ETH): <span className="text-red-500">*</span></label>
                                        <input type="number" id="offerPrice" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder="e.g., 1.5" step="any" min="0" className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="offerMessage" className="block text-gray-700 text-sm font-bold mb-1">Message (Optional):</label>
                                        <textarea id="offerMessage" value={offerMessage} onChange={(e) => setOfferMessage(e.target.value)} placeholder="Add an optional message..." rows={2} className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={handleMakeOffer} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50" disabled={!offerPrice || isNaN(parseFloat(offerPrice)) || parseFloat(offerPrice) <= 0}>Submit Offer</button>
                                        <button onClick={() => setIsOfferFormVisible(false)} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center p-4">
                         <p className="text-center text-gray-500 text-lg">{!connectedWallet ? "Please connect your wallet." : (threads.length === 0 && !error && !propertiesLoading) ? "No conversations found." : (propertiesLoading || (threads.length > 0 && Object.keys(propertyNames).length === 0)) ? "Loading conversations..." : "Select a conversation to view messages."}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatPage;