//AddProperty.jsx
import React, { useState, useCallback } from "react";
import { ethers } from "ethers";
import contractABI from "./../../contractABI.json"; // Update with your ABI file path
import { useAddress } from "@thirdweb-dev/react";

const contractAddress = "0x3d36F275F55cF1121eC6cA6C325954BdD3a9c868"; // Replace with your contract address

async function loadContract() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    return contract;
}

const PropertyForm = () => {
  const address = useAddress(); // Get wallet address from thirdweb
  const [formData, setFormData] = useState({
    propertyTitle: "", // Changed from propertyName
    propertyAddress: "", // Changed from location
    category: "Apartment", // Changed from propertyType
    size: "",
    price: "", // Changed from tokens, and using price
    streetAddress: "",
    cityTown: "",
    state: "",
    pinCode: "",
    description: "", // Changed from landmark
    images: [], // Use array to store multiple files, changed from documentUpload and mapUpload
  });
  const [nftId, setNftId] = useState(""); // NFT ID
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateNftId = useCallback(() => {
    const combinedString = `${formData.propertyTitle}-${formData.propertyAddress}-${formData.category}-${formData.size}-${formData.price}`;
    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(combinedString));
    setNftId(hash);
    return hash;
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "file" ? Array.from(files) : value, // Store file array
    }));

    if (name !== "images") { // Generate NFT ID when other input changes
      //Debounce generating hash so that we dont overdo it while input changes
      //Use a very small time so that its almost instant.
      setTimeout(() => {
        generateNftId();
      }, 50);
    }
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!address) {
        alert("Please connect your wallet!");
        return;
      }

      const contract = await loadContract();

      // Convert price to a number
      const priceInWei = ethers.utils.parseEther(formData.price); // Ensure price is in ETH

      // Convert images to URLs (you might need to upload them to a service like IPFS)
      const imageUrls = await Promise.all(formData.images.map(async (image) => {
        return URL.createObjectURL(image);  // For preview and testing, replace with IPFS upload
      }));

      //Ensure that all the fields is valid to create a hash so that on submit
      //The smart contract actually generates something since it uses the
      //same data that is given in the form.
      if (nftId == "") {
        generateNftId();
      }

      // Call the smart contract function to add the property
      const transaction = await contract.AddProperty(
        address,
        priceInWei,
        formData.propertyTitle,
        formData.category,
        imageUrls,
        formData.propertyAddress,
        formData.description,
        nftId, // Pass the generated NFT ID
        { gasLimit: 3000000 }
      );

      await transaction.wait(); // Wait for the transaction to be mined

      alert("Property listed successfully!");
      // Reset the form
      setFormData({
        propertyTitle: "",
        propertyAddress: "",
        category: "Apartment",
        size: "",
        price: "",
        streetAddress: "",
        cityTown: "",
        state: "",
        pinCode: "",
        description: "",
        images: [],
      });
    } catch (error) {
      console.error("Error listing property:", error);
      alert(`Failed to list property: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [address, formData, generateNftId, nftId]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          List Your Property on Novaland
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="propertyTitle" className="block text-sm font-medium text-gray-700">
              Property Name:
            </label>
            <input
              type="text"
              name="propertyTitle"
              id="propertyTitle"
              value={formData.propertyTitle}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="propertyAddress" className="block text-sm font-medium text-gray-700">
              Location:
            </label>
            <input
              type="text"
              name="propertyAddress"
              id="propertyAddress"
              value={formData.propertyAddress}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Property Type:
            </label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Land">Land</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">
              Property Size (sq ft):
            </label>
            <input
              type="number"
              name="size"
              id="size"
              value={formData.size}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (ETH):
            </label>
            <input
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">
              Street Address:
            </label>
            <input
              type="text"
              name="streetAddress"
              id="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="cityTown" className="block text-sm font-medium text-gray-700">
              City/Town:
            </label>
            <input
              type="text"
              name="cityTown"
              id="cityTown"
              value={formData.cityTown}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State:
            </label>
            <input
              type="text"
              name="state"
              id="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700">
              Pin Code:
            </label>
            <input
              type="text"
              name="pinCode"
              id="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description:
            </label>
            <input
              type="text"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">
              Upload Property Images (Max 6):
            </label>
            <input
              type="file"
              name="images"
              id="images"
              onChange={handleChange}
              multiple
              accept="image/*"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="nftId" className="block text-sm font-medium text-gray-700">
              NFT ID:
            </label>
            <input
              type="text"
              name="nftId"
              id="nftId"
              value={nftId}
              readOnly
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            {formData.images.length > 0 && (
              <div className="flex space-x-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="w-24 h-24 relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Property Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "List Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;