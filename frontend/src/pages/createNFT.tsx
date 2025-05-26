import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/components/store/store";
import { shortenAddress } from "@/components/ui/ShortenAddress";
import { useAccount, useConnect } from "wagmi";
import { uploadMetadataToIPFS, uploadToIPFS } from "@/utils/uploadIpfs";
import PreviewNFT from "@/components/HelperCom/PreviewNFT";
import { createNFT, getMarketplaceFee } from "@/reducer/nftSlice";
import FormInput from "@/components/HelperCom/FormInput";
import { IoCloseSharp } from "react-icons/io5";

const createNft = () => {
  const fee = useSelector((state: RootState) => state.nft.fee);
  const dispatch = useDispatch<AppDispatch>();

  const feePercent = useMemo(() => (fee ? fee / 10 : 0), [fee]);
  useEffect(() => {
    console.log(feePercent);
    
    dispatch(getMarketplaceFee());
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
    <div className="min-h-screen max-w-md md:max-w-lg lg:max-w-3xl xl:max-w-4xl bg-white mx-auto flex flex-col gap-4">
      {!isConnected ? (
        <div className="flex flex-col items-center justify-center h-screen text-center">
          <h3 className="text-2xl font-bold">Connect Your Wallet</h3>
          <p className="text-grayborder mt-2">
            You need to connect your wallet to create an NFT.
          </p>
          <button
            onClick={() => handleConnect(metaMaskConnector)}
            className="mt-4 bg-blue text-white px-4 py-2 rounded-md hover:bg-[#689ea2]"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <>
          <h3>Create your NFT</h3>
          <p>Single edition on Ethereum</p>
          <div className="w-full flex">
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-5 md:col-span-2">
                <div className="w-full px-4 py-2 rounded-xl border border-[#d9dddd] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/eth.svg"
                      width={50}
                      height={50}
                      alt="eth logo"
                    />
                    <div className="text-sm">
                      {address && (
                        <p className="font-bold">{shortenAddress(address)}</p>
                      )}
                      <p className="font-extralight">Ethereum</p>
                    </div>
                  </div>
                  <div className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
                    Connected
                  </div>
                </div>

                <h5 className="mt-5">Upload file</h5>
                <div
                  className={`${
                    preview
                      ? "flex justify-between gap-1 bg-grayborder h-full"
                      : "h-72"
                  } border-dashed border-2 p-6 w-full flex justify-center items-center mt-2 border-[#d9dddd] rounded-2xl relative`}
                >
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="NFT Preview"
                        className="w-full h-full rounded-lg"
                      />
                      <IoCloseSharp
                        size={24}
                        onClick={() => setPreview(null)}
                        className="cursor-pointer"
                      />
                    </>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <span className="text-black p-3 bg-gray-light">
                        Upload file
                      </span>
                    </label>
                  )}
                </div>

                <FormInput
                  label="Price"
                  placeholder="Enter price"
                  type="text"
                  value={price}
                  icon="ETH"
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    if ((value.match(/\./g) || []).length <= 1) {
                      setPrice(value);
                    }
                  }}
                />
                <div className="w-full border border-[#d9dddd] rounded-xl p-3 flex flex-col gap-4">
                  <div className="flex items-center justify-between ">
                    <p className="text-[rgb(141, 141, 159)]">Price</p>
                    <p>{price ? `${parseFloat(price)} ETH` : "-"}</p>
                  </div>
                  <div className="flex items-center justify-between ">
                    <p className="text-[rgb(141, 141, 159)]">Leox fee ?</p>
                    <p>{fee !== null && fee !== undefined ? `${fee}%` : "—"}</p>
                  </div>
                  <div className="w-full h-[2px] bg-[#e8eeee] rounded-3xl" />
                  <div className="flex items-center justify-between">
                    <p className="text-[rgb(141, 141, 159)]">
                      You will receive
                    </p>
                    <p>
                      {price && fee !== undefined
                        ? `${(
                            parseFloat(price) -
                            parseFloat(price) * (fee / 100)
                          ).toFixed(4)} ETH`
                        : "—"}
                    </p>
                  </div>
                </div>
                <FormInput
                  label="Supply"
                  placeholder="10"
                  type="text"
                  value={supply}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    if ((value.match(/\./g) || []).length <= 1) {
                      setSupply(value);
                    }
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
                  className="w-full bg-blue text-black font-semibold py-3 rounded-lg hover:bg-blue focus:outline-none focus:ring-2 focus:ring-blue disabled:bg-gray"
                >
                  {loading ? "Creating NFT..." : "Create NFT"}
                </button>
              </div>
              <div className="hidden md:block sticky top-0 h-fit">
                <PreviewNFT preview={preview} price={price} name={name} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default createNft;
