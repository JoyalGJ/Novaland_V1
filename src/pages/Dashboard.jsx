import { useState } from "react";
import { Home, User, Settings, LogOut, DollarSign, Handshake, Plus, ChartAreaIcon } from "lucide-react"; // Icons for menu
import { Paper } from "@mui/material";  
import {Link} from "react-router-dom";
import { motion } from "framer-motion";


function Dashboard() {
  const [properties, setProperties] = useState([]);

  return (
    <div className="w-full min-h-screen flex bg-gray-100">
      {/* Left Menu */}
      <aside className="w-64 bg-indigo-900 text-white min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav className="flex flex-col space-y-4">
          <a href="#" className="flex items-center space-x-3 p-2 hover:bg-indigo-700 rounded-md">
            <Home className="w-5 h-5" /> <span>My Properties</span>
          </a>
          <Link to="/Chat">
            <a href="#" className="flex items-center space-x-3 p-2 hover:bg-indigo-700 rounded-md">
              <ChartAreaIcon className="w-5 h-5" /> <span>Conversations</span>
            </a>
          </Link>
          <a href="#" className="flex items-center space-x-3 p-2 hover:bg-indigo-700 rounded-md">
            <DollarSign className="w-5 h-5" /> <span>Transactions</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-2 hover:bg-indigo-700 rounded-md">
            <Settings className="w-5 h-5" /> <span>Settings</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-2 hover:bg-red-700 rounded-md mt-auto">
            <LogOut className="w-5 h-5" /> <span>Logout</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center p-6">
        {/* Profile Box */}
        <div className="w-full max-w-4xl bg-indigo-800 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center">
          {/* Profile Upload Section */}
          <label className="relative cursor-pointer">
            <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center bg-white shadow-md transition hover:border-blue-500">
              <img
                src="https://cdn1.vectorstock.com/i/1000x1000/46/55/person-gray-photo-placeholder-woman-vector-22964655.jpg"
                alt="Uploaded Photo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </label>

          {/* Info Section */}
          <div className="mt-4 text-center">
            <h2 className="text-lg font-semibold">John Doe</h2>
            <p className="text-sm">johndoe@example.com</p>
            <p className="text-sm">Wallet: 0x1234...abcd</p>
          </div>
        </div>

        {/* Property Listings Section */}
        <div className="mt-6 w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">My Property Listings</h3>
          
          {/* Property Display Box */}
          <div className="border p-4 rounded-lg min-h-[100px] mt-4">
            {properties.length > 0 ? (
              <ul>
                {properties.map((property) => (
                  <li key={property.id} className="p-2 border-b">
                    {property.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No properties added yet.</p>
            )}
          </div>

          {/* Add Property Button */}
    
        <Link to="/propertyform">
        <motion.button className="bg-indigo-900 border-2 border-white text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-indigo-800" whileHover={{ scale: 1.1 }}>Add Property </motion.button>
        </Link>
        
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
