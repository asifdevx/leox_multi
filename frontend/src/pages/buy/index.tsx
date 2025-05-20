import React, { useState } from "react";

const index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile)); // Show preview
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-gray-100 rounded-xl">
      {/* Wallet Status */}
      <div className="flex items-center gap-2 border p-2 rounded-lg">
        <img src="/eth-icon.svg" alt="Ethereum" className="w-6 h-6" />
        <span className="text-gray-700 font-medium">0x08e...5508</span>
        <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
          Connected
        </span>
      </div>

      {/* Upload File Section */}
      <div className="border-dashed border-2 p-6 w-72 h-72 flex justify-center items-center relative">
        {preview ? (
          <img src={preview} alt="NFT Preview" className="w-full h-full object-cover rounded-lg" />
        ) : (
          <label className="cursor-pointer">
            <input type="file" onChange={handleFileUpload} className="hidden" />
            <span className="text-gray-500">Upload file</span>
          </label>
        )}
      </div>

      {/* NFT Preview Card */}
      {preview && (
        <div className="border rounded-lg p-4 bg-white w-64 shadow-lg">
          <img src={preview} alt="NFT Preview" className="w-full rounded-lg" />
          <div className="mt-2">
            <p className="text-gray-500 text-xs">Rarible x Ethereum ERC-721</p>
            <h3 className="font-bold">leoX</h3>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <p>Price</p>
              <p>Highest bid</p>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <p className="text-gray-500">Not for sale</p>
              <p className="text-gray-500">No bids yet</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default index;
