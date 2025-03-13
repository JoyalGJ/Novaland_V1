import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import contractABI from "./../../contractABI.json";
import { useClerk } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import { useAddress } from "@thirdweb-dev/react";
import AddPropertyForm from "./PropertyForm"; // Import AddProperty Form

const contractAddress = "0x3d36F275F55cF1121eC6cA6C325954BdD3a9c868";

async function loadContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  return contract;
}

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [myProperties, setMyProperties] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showAddProperty, setShowAddProperty] = useState(false); // State to toggle AddProperty form

  const { userId, sessionId, getToken } = useAuth();
  const { user: clerkUser } = useClerk();
  const address = useAddress();

  const fetchUserProperties = useCallback(async (walletAddress) => {
    try {
      const contract = await loadContract();
      const properties = await contract.FetchUserProperties(walletAddress, { gasLimit: 3000000 });

      const formattedProperties = properties.map((property) => ({
        name: property.propertyTitle,
        location: property.propertyAddress,
        tokens: ethers.utils.formatEther(property.price),
      }));

      setMyProperties(formattedProperties);
    } catch (error) {
      console.error("Error fetching user properties:", error);
      setMyProperties([]);
    }
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (address && clerkUser) {
          setUser({
            name: clerkUser.firstName + " " + clerkUser.lastName,
            wallet: address,
            email: clerkUser.emailAddresses[0].emailAddress,
          });

          await fetchUserProperties(address);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setUser(null);
        setMyProperties([]);
      }
    };

    loadUserData();
  }, [fetchUserProperties, clerkUser, address]);

  const toggleAddProperty = () => {
    setShowAddProperty(!showAddProperty);
  };

  const handleCancelAddProperty = () => {
    const hasFilledData = Object.values(AddPropertyForm).some(value => value !== '' && value !== [] && value !== false); // Check if any field has been filled
      
        if (hasFilledData && window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
            setShowAddProperty(false);
          
        }
        else{
          setShowAddProperty(false);
        }
  }

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">NovaLand</h2>
        <ul className="space-y-4">
          <li>
            <button onClick={toggleAddProperty} className="hover:text-gray-300">
              {showAddProperty ? "Hide Add Property" : "Add Property"}
            </button>
          </li>
          <li><a href="#" className="hover:text-gray-300">My Properties</a></li>
          <li><a href="#" className="hover:text-gray-300">Transactions</a></li>
          <li><a href="Chat" className="hover:text-gray-300">Conversations</a></li>
          <li><a href="#" className="hover:text-gray-300">Settings</a></li>
          <li><a href="#" className="text-red-500 hover:text-red-300">Logout</a></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="w-3/4 p-8 relative"> {/*Make it Relative */ }
        {/* Profile Section */}
        <section className="flex flex-col items-center text-center mb-8">
          <img
            src={clerkUser.imageUrl}
            alt="User Profile"
            className="w-24 h-24 rounded-full border-2 border-gray-500 mb-4"
          />
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">Wallet: {user.wallet}</p>
          <p className="text-gray-600">Email: {user.email}</p>
        </section>

        {/* Add Property Form as Overlay */}
        {showAddProperty && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
                <button onClick={handleCancelAddProperty} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"> {/*Added cancel button */}
                  Cancel
                </button>
                <h3 className="text-lg font-semibold mb-4">Add New Property</h3>
                <AddPropertyForm />
            </div>
          </div>
        )}

        {/* Properties Section */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4">My Properties</h3>
          <div className="grid grid-cols-2 gap-4">
            {myProperties.length > 0 ? (
              myProperties.map((property, index) => (
                <div key={index} className="p-4 border border-gray-300 rounded-lg shadow-md">
                  <strong>{property.name}</strong>
                  <p className="text-gray-600">Location: {property.location}</p>
                  <p className="text-gray-600">Tokens: {property.tokens}</p>
                </div>
              ))
            ) : (
              <div>No properties found for this user.</div>
            )}
          </div>
        </section>

        {/* Transactions Section */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
          <ul className="border border-gray-300 p-4 rounded-lg shadow-md">
            {transactions.length > 0 ? (
              transactions.map((txn, index) => (
                <li key={index} className="text-gray-700">{txn.type} {txn.property} - {txn.amount}</li>
              ))
            ) : (
              <li>No transactions available.</li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default UserProfile;