import React, { useState, useEffect, useCallback, useRef } from "react";
import { ethers } from "ethers";
import { supabase } from "../../supabase";
import moment from "moment";
import contractABI from "../../contractABI.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faGift, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const ChatPage = () => {
    const [threads, setThreads] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeThread, setActiveThread] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [offerPrice, setOfferPrice] = useState("");
    const [offerMessage, setOfferMessage] = useState("");
    const [connectedWallet, setConnectedWallet] = useState("");
    const [userNames, setUserNames] = useState({});
    const [isOfferPending, setIsOfferPending] = useState(false);
    const [propertyName, setPropertyName] = useState("");
    const [isOfferFormVisible, setIsOfferFormVisible] = useState(false);
    const messagesEndRef = useRef(null);
    const [isBuyerView, setIsBuyerView] = useState(true);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const connectWallet = useCallback(async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const account = await signer.getAddress();
                setConnectedWallet(account.toLowerCase());
            } catch (err) {
                console.error("Error connecting to MetaMask:", err);
            }
        } else {
            console.error("MetaMask not found.");
        }
    }, []);

    const fetchUserNames = useCallback(async (wallets) => {
        if (!wallets?.length) return;
        try {
            const { data, error } = await supabase.from("users").select("wallet_address, name").in("wallet_address", wallets);
            if (error) { console.error("Error fetching user names:", error); return; }
            const nameMap = {};
            data.forEach(user => {
                nameMap[user.wallet_address] = user.name || `${user.wallet_address.substring(0, 6)}...${user.wallet_address.slice(-4)}`;
            });
            setUserNames(prev => ({ ...prev, ...Object.fromEntries(data.map(u => [u.wallet_address, u.name || `${u.wallet_address.substring(0, 6)}...${u.wallet_address.slice(-4)}`])) }));
        } catch (error) {
            console.error("Error in fetchUserNames:", error);
        }

    }, []);

    const fetchPropertyName = useCallback(async (propertyAddress) => {
        if (!propertyAddress) return;
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract("0x3d36F275F55cF1121eC6cA6C325954BdD3a9c868", contractABI, provider);
            const name = await contract.getPropertyName(propertyAddress);
            setPropertyName(name);
        } catch (error) {
            console.error("Error fetching property name:", error);
            setPropertyName("Unknown Property");
        }
    }, []);

    const fetchThreads = useCallback(async () => {
        if (!connectedWallet) return;
        try {
            const { data, error } = await supabase.from("threads").select("*").or(`buyer_wallet.eq.${connectedWallet},seller_wallet.eq.${connectedWallet}`).order("created_at", { ascending: false });
            if (error) { console.error("Error fetching threads:", error); return; }
            if (!data?.length) { setThreads([]); return; }

            setThreads(data);
            const wallets = data.flatMap(t => [t.buyer_wallet, t.seller_wallet]);
            await fetchUserNames(wallets);
            data.forEach(thread => fetchPropertyName(thread.property_address));


        } catch (error) { console.error("Error in fetchThreads:", error); }
    }, [connectedWallet, fetchUserNames, fetchPropertyName]);

    const fetchMessages = useCallback(async (threadId) => {
        if (!threadId) return;

        try {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .eq("thread_id", threadId)
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Error fetching messages:", error);
                return;
            }

            setMessages(data ? [...data].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) : []);
            const wallets = data.map(msg => msg.sender_wallet);
            await fetchUserNames(wallets);
            setIsOfferPending(data.some(msg => msg.type === 'offer' && msg.status === 'pending'));
            scrollToBottom();
        } catch (error) {
            console.error("Error in fetchMessages:", error);
        }
    }, [fetchUserNames, scrollToBottom]);

    const markMessagesAsRead = useCallback(async (threadId) => {
        if (!threadId || !connectedWallet) return;

        try {
            const { data: unreadMessages, error: unreadError } = await supabase
                .from('messages')
                .select('*')
                .eq('thread_id', threadId)
                .neq('sender_wallet', connectedWallet)
                .is('is_read', null);

            if (unreadError) {
                console.error('Error fetching unread messages:', unreadError);
                return;
            }

            if (unreadMessages && unreadMessages.length > 0) {
                for (const message of unreadMessages) {
                    const { error: updateError } = await supabase
                        .from('messages')
                        .update({ is_read: true })
                        .eq('id', message.id);

                    if (updateError) {
                        console.error('Error marking message as read:', updateError);
                    }
                }

                fetchMessages(threadId);
            }
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    }, [connectedWallet, fetchMessages]);

    const getThreadName = (thread) => {
         if (!thread) return "Unknown";
            const otherWallet = isBuyerView ? thread.seller_wallet : thread.buyer_wallet;
           return userNames[otherWallet] || otherWallet.substring(0, 6) + '...' + otherWallet.slice(-4)
    }

    useEffect(() => {
        connectWallet();
    }, [connectWallet]);

    useEffect(() => {
        if (connectedWallet) {
            fetchThreads();
        }
    }, [fetchThreads, connectedWallet]);

    useEffect(() => {
        if (!connectedWallet) return;

        const threadsSubscription = supabase
            .channel('threads')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'threads' },
                (payload) => {
                    console.log('Thread change received', payload);
                    fetchThreads();
                }
            )
            .subscribe();

        const messagesSubscription = supabase
            .channel('messages')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'messages' },
                (payload) => {
                    console.log('Message change received', payload);
                    if (activeThread) {
                        fetchMessages(activeThread.id);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(threadsSubscription);
            supabase.removeChannel(messagesSubscription);
        };
    }, [connectedWallet, fetchThreads, fetchMessages, activeThread]);

    useEffect(() => {
        if (activeThread) {
            markMessagesAsRead(activeThread.id);
        }
    }, [activeThread, markMessagesAsRead]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !activeThread || activeThread.status === "closed")
            return;

        try {
            await supabase.from("messages").insert({
                thread_id: activeThread.id,
                sender_wallet: connectedWallet,
                message: newMessage,
                type: "message",
                
            });
            setNewMessage("");
            fetchMessages(activeThread.id); // Refresh messages after sending
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleMakeOffer = async () => {
        if (!offerPrice || !activeThread || activeThread.status === "closed" || isOfferPending) {
            return;
        }

        if (isNaN(offerPrice) || parseFloat(offerPrice) <= 0) {
            alert("Please enter a valid offer price.");
            return;
        }

        try {
            await supabase.from("messages").insert({
                thread_id: activeThread.id,
                sender_wallet: connectedWallet,
                message: offerMessage,
                price: parseFloat(offerPrice),
                type: "offer",
                status: "pending",
            });
            setIsOfferPending(true);
            setIsOfferFormVisible(false);
            setOfferPrice("");
            setOfferMessage("");
            fetchMessages(activeThread.id); // Refresh messages after making offer
        } catch (error) {
            console.error("Error making offer:", error);
        }
    };

    const handleAcceptOffer = async (offerId) => {
        try {
            const { data: updatedMessage, error: updateError } = await supabase
                .from("messages")
                .update({ status: "accepted" })
                .eq("id", offerId)
                .select()
                .single(); // Get the updated message

            if (updateError) {
                console.error("Error accepting offer:", updateError);
                return;
            }

            await supabase.from("threads").update({ status: "closed" }).eq("id", activeThread.id);
            setThreads(prevThreads =>
                prevThreads.map(thread =>
                    thread.id === activeThread.id ? { ...thread, status: "closed" } : thread
                )
            );
            setActiveThread(prevState => ({ ...prevState, status: 'closed' }));
            setIsOfferPending(false);
            fetchThreads(); // Refresh threads and messages after accepting offer
            fetchMessages(activeThread.id);
        } catch (error) {
            console.error("Error accepting offer:", error);
        }
    };

    const handleRejectOffer = async (offerId) => {
        try {
            await supabase.from("messages").update({ status: "rejected" }).eq("id", offerId);
            setIsOfferPending(false);
            fetchMessages(activeThread.id); // Refresh messages after rejecting offer
        } catch (error) {
            console.error("Error rejecting offer:", error);
        }
    };

    const isThreadUnread = (thread) => {
        if (!activeThread) return false;
        if (messages.length > 0) {
            const latestMessage = messages[messages.length - 1];
            return latestMessage.sender_wallet !== connectedWallet && activeThread?.id !== thread.id;
        }
        return false;
    };

    const determineThreadStyle = (thread) => {
        if (activeThread?.id === thread.id) {
            return 'bg-blue-100';
        } else if (thread.status === "closed") {
            return 'bg-gray-100 text-gray-500 hover:bg-gray-200';
        } else {
            return 'hover:bg-gray-100';
        }
    };

    const getFilteredThreads = () => {
    // Determine if the current user is the buyer or seller
    return threads.filter(thread => {
        return isBuyerView
            ? thread.buyer_wallet === connectedWallet
            : thread.seller_wallet === connectedWallet;
    });
};

const toggleView = () => {
    if (threads.length > 0) {
        // Determine the view based on the first thread
        setIsBuyerView(threads[0].buyer_wallet === connectedWallet);
    } else {
        setIsBuyerView(true); // default to buyer if no threads are loaded.
    }
};


    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-1/4 border-r p-4 bg-white shadow-md">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Conversations</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        View as:
                    </label>
                    <div className="flex items-center">
                         <button
                            className={`px-4 py-2 rounded-full ${isBuyerView ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setIsBuyerView(true)}
                        >
                            Buyer
                        </button>
                        <button
                            className={`px-4 py-2 rounded-full ml-2 ${!isBuyerView ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setIsBuyerView(false)}
                        >
                            Seller
                        </button>
                    </div>
                </div>
                <div className="space-y-3">
       {getFilteredThreads().map((thread) => (
        <div
            key={thread.id}
            className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors duration-200 ${determineThreadStyle(thread)} ${isThreadUnread(thread) ? "font-semibold unread-thread animate-pulse" : ""} hover:scale-105 hover:shadow-md`}
            onClick={() => {
                setActiveThread(thread);
                fetchMessages(thread.id);
                fetchPropertyName(thread.property_address);
            }}
            style={{ transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out' }}
        >
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-lg text-gray-700">👤</span>
            </div>
            <div>
                <div className="text-lg font-medium text-gray-800">
                  {userNames[thread.seller_wallet] ||  thread.seller_wallet.substring(0, 6) + '...' +  thread.seller_wallet.slice(-4)}
                </div>
                <div className="text-sm text-gray-600">{propertyName}</div>
            </div>
        </div>
    ))}
</div>

            </aside>

            {/* Chat Area */}
            <div className="w-3/4 flex flex-col bg-gray-50">
                {activeThread ? (
                    <>
                        {/* Header */}
                        <div className="border-b p-6 bg-white shadow-sm">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Chat with {getThreadName(activeThread)}
                            </h2>
                            <p className="text-gray-600">Property: {propertyName}</p>
                        </div>

                        {/* Green Banner if Offer Accepted */}
                        {activeThread.status === "closed" && (
                            <div className="bg-green-500 text-white p-3 text-center font-semibold">
                                OFFER ACCEPTED:{" "}
                                {messages.find((msg) => msg.status === "accepted")?.price} ETH
                            </div>
                        )}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`transition-all duration-300 ${msg.sender_wallet === connectedWallet ? "ml-auto items-end" : "items-start"}`}
                                >
                                    {msg.type === "message" ? (
                                        <div
                                            className={`p-4 rounded-xl ${msg.sender_wallet === connectedWallet
                                                ? "bg-blue-600 text-white rounded-tr-none"
                                                : "bg-gray-100 text-gray-800 rounded-tl-none"
                                                } max-w-lg animate-fadeIn`}
                                            style={{ animationDuration: "0.3s" }}
                                        >
                                            <p className="text-sm break-words">{msg.message}</p>
                                             <span className="text-xs mt-2 text-gray-400">
                                                {moment(msg.created_at).fromNow()}
                                            </span>
                                        </div>
                                    ) : (
                                        <div
                                            className="bg-white border rounded-lg shadow-md p-4 max-w-md animate-fadeIn"
                                            style={{ animationDuration: "0.3s" }}
                                        >
                                            <div className="mb-2">
                                                <span className="text-lg font-semibold text-gray-800">
                                                    Offer: {msg.price} ETH
                                                </span>
                                            </div>
                                            {msg.message && (
                                                <p className="text-gray-700 text-sm mb-3">{msg.message}</p>
                                            )}
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 text-xs">
                                                    {moment(msg.created_at).fromNow()}
                                                </span>
                                                {msg.status === "pending" &&
                                                    activeThread.status !== "closed" &&
                                                    msg.sender_wallet !== connectedWallet && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleAcceptOffer(msg.id)}
                                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                                                            >
                                                                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectOffer(msg.id)}
                                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                                                            >
                                                                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                {msg.status !== "pending" && (
                                                    <span
                                                        className={`text-sm font-semibold ${msg.status === "accepted"
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                            }`}
                                                    >
                                                        {msg.status.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white border-t shadow-sm">
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && newMessage.trim()) {
                                            handleSendMessage();
                                        }
                                    }}
                                    disabled={activeThread.status === "closed"}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition-colors duration-200 ${activeThread.status === "closed" ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={activeThread.status === "closed" || !newMessage.trim()}
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                                    Send
                                </button>

                                <button
                                    onClick={() => setIsOfferFormVisible(!isOfferFormVisible)}
                                    className={`bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition-colors duration-200 ${activeThread.status === "closed" || isOfferPending ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={activeThread.status === "closed" || isOfferPending}
                                >
                                    <FontAwesomeIcon icon={faGift} className="mr-2" />
                                    Offer
                                </button>
                            </div>

                            {/* Offer Form */}
                            {isOfferFormVisible && (
                                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                        Make an Offer
                                    </h3>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="offerPrice"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            Offer Price (ETH):
                                        </label>
                                        <input
                                            type="number"
                                            id="offerPrice"
                                            value={offerPrice}
                                            onChange={(e) => setOfferPrice(e.target.value)}
                                            placeholder="Enter price"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="offerMessage"
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                        >
                                            Offer Message:
                                        </label>
                                        <textarea
                                            id="offerMessage"
                                            value={offerMessage}
                                            onChange={(e) => setOfferMessage(e.target.value)}
                                            placeholder="Enter your message"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        ></textarea>
                                    </div>
                                    <button
                                        onClick={handleMakeOffer}
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        disabled={!offerPrice}
                                    >
                                        Submit Offer
                                    </button>
                                    <button
                                        onClick={() => setIsOfferFormVisible(false)}
                                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-center text-gray-600 text-lg">
                            Select a thread to start chatting.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;