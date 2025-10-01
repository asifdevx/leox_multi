import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/components/store/store";
import { shortenAddress } from "@/components/ui/ShortenAddress";
import { useAccount, useConnect } from "wagmi";
import { uploadMetadataToIPFS, uploadToIPFS } from "@/utils/uploadIpfs";
import PreviewNFT from "@/components/HelperCom/PreviewNFT";
import { createNFT } from "@/reducer/nftSlice";
import FormInput from "@/components/HelperCom/FormInput";
import { IoCloseSharp } from "react-icons/io5";
import { fatchFee } from "@/reducer/feeSlice";

const createNft = () => {
  const fee = useSelector((state: RootState) => state.fee.value);
  const dispatch = useDispatch<AppDispatch>();

  const feePercent = useMemo(() => (fee ? fee / 10 : 0), [fee]);
  useEffect(() => {
    console.log(feePercent);
    
    dispatch(fatchFee());
  }, []);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [supply, setSupply] = useState("");
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  
  const handleCreateNFT = async () => {
    if (!isConnected) return;
    setLoading(true);
    setError(null);

    if (!file || !name || !description || !price) {
      setError("Please fill all fields and select an image.");
      setLoading(false);
      return;
    }

    try {
      const imageCID = await uploadToIPFS(file);
      if (!imageCID) throw new Error("Failed to upload image to IPFS");

      const tokenURI = await uploadMetadataToIPFS(name, description, imageCID);
      if (!tokenURI) throw new Error("Failed to generate metadata URI");

      const response = await dispatch(
        createNFT({
          tokenURI,
          supply: parseFloat(supply),
          price: parseFloat(price),
        })
      ).unwrap();

      setPreview(null);
      setName("");
      setDescription("");
      setSupply("");
      setPrice("");
      setFile(null);
      console.log("NFT Created:", response);
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
    }
  };

  const metaMaskConnector = connectors.find(
    (connector) => connector.name === "MetaMask"
  );

  async function handleConnect(connector: any) {
    try {
      await connectAsync({ connector });
    } catch (error) {
      console.error("Connection failed:", error);
    }
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto w-full flex flex-col items-center py-12 px-6">
    {!isConnected ? (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h3 className="text-3xl font-bold text-white">Connect Your Wallet</h3>
        <p className="text-gray-400 mt-2">
          You need to connect your wallet to create an NFT.
        </p>
        <button
          onClick={() => handleConnect(metaMaskConnector)}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-[#00d1ff] to-[#7c3aed] 
          text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 
          hover:scale-105 transition-all"
        >
          Connect Wallet
        </button>
      </div>
    ) : (
      <>
        <h2 className="text-3xl font-extrabold text-white mb-2">
          Create Your NFT
        </h2>
        <p className="text-gray-400 mb-8">
          Single edition on <span className="text-[#00d1ff]">Ethereum</span>
        </p>
  
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left side form */}
          <div className="flex flex-col gap-6 md:col-span-2">
            {/* Wallet Status */}
            <div className="px-4 py-3 rounded-xl bg-[#0f1f33] border border-[#1e3350] flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <Image src="/eth.svg" width={50} height={50} alt="eth logo" />
                <div className="text-sm">
                  {address && (
                    <p className="font-bold text-white">
                      {shortenAddress(address)}
                    </p>
                  )}
                  <p className="text-gray-400">Ethereum</p>
                </div>
              </div>
              <div className="text-green-400 bg-green-900/30 px-3 py-1 rounded-full text-sm">
                Connected
              </div>
            </div>
  
            {/* Upload */}
            <h5 className="text-white font-semibold">Upload File</h5>
            <div
              className={`${
                preview
                  ? "flex justify-between gap-1 bg-[#0f1f33] h-full"
                  : "h-72"
              } border-dashed border-2 border-[#1e3350] rounded-2xl p-6 w-full flex justify-center items-center relative hover:border-[#00d1ff]/60 transition-all`}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="NFT Preview"
                    className="w-full h-full rounded-lg object-cover"
                  />
                  <IoCloseSharp
                    size={28}
                    onClick={() => setPreview(null)}
                    className="cursor-pointer absolute top-3 right-3 text-white hover:text-red-400 transition"
                  />
                </>
              ) : (
                <label className="cursor-pointer text-gray-300 hover:text-white transition">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="px-6 py-3 bg-[#1e3350] rounded-lg">
                    Upload File
                  </span>
                </label>
              )}
            </div>
  
            {/* Price Input */}
            <FormInput
              label="Price"
              placeholder="Enter price"
              type="text"
              value={price}
              icon="ETH"
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, "");
                if ((value.match(/\./g) || []).length <= 1) setPrice(value);
              }}
            />
  
            {/* Summary Box */}
            <div className="w-full rounded-xl p-4 bg-[#0f1f33] border border-[#1e3350] shadow-inner flex flex-col gap-4">
              <div className="flex justify-between text-gray-400">
                <span>Price</span>
                <span className="text-white">{price ? `${price} ETH` : "-"}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Leox Fee</span>
                <span className="text-white">
                  {fee !== null && fee !== undefined ? `${fee}%` : "—"}
                </span>
              </div>
              <div className="w-full h-[1px] bg-[#1e3350]" />
              <div className="flex justify-between text-gray-400">
                <span>You will receive</span>
                <span className="text-[#00d1ff] font-semibold">
                  {price && fee !== undefined
                    ? `${(
                        parseFloat(price) -
                        parseFloat(price) * (fee / 100)
                      ).toFixed(4)} ETH`
                    : "—"}
                </span>
              </div>
            </div>
  
            <FormInput
              label="Supply"
              placeholder="10"
              type="text"
              value={supply}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, "");
                if ((value.match(/\./g) || []).length <= 1) setSupply(value);
              }}
            />
  
            <FormInput
              label="Name"
              placeholder='e.g. "Redeemable T-Shirt with logo"'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FormInput
              label="Description"
              placeholder='e.g. "After purchasing, you will receive a real T-Shirt"'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
  
            <button
              type="button"
              onClick={handleCreateNFT}
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white 
              bg-gradient-to-r from-[#00ff95] to-[#00d1ff] 
              shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all 
              disabled:opacity-50"
            >
              {loading ? "Creating NFT..." : "Create NFT"}
            </button>
          </div>
  
          {/* Right side Preview */}
          <div className="hidden md:block top-6 h-fit">
            <PreviewNFT preview={preview} price={price} name={name} />
          </div>
        </div>
      </>
    )}
  </div>
  
  );
};

export default createNft;
