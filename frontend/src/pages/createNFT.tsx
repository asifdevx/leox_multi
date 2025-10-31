import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { shortenAddress } from '@/utils/ShortenAddress';
import { useAccount } from 'wagmi';
import { uploadMetadataToIPFS, uploadToIPFS } from '@/utils/uploadIpfs';
import PreviewNFT from '@/components/Com/HelperCom/PreviewNFT';
import { createNFT } from '@/reducer/nftSlice';
import FormInput from '@/components/Com/HelperCom/FormInput';
import { IoCloseSharp } from 'react-icons/io5';

import Button from '@/components/ui/Button';
import ConnectBtn from '@/components/Com/HelperCom/ConnectBtn';
import FixedNFTForm from '@/components/Com/createCom/FixedNFTForm';
import AuctionNFTForm from '@/components/Com/createCom/AuctionNFTForm';
import { fatchMarketplaceFee } from '@/hooks/fatchMarketplaceFee';
import { AppDispatch } from '@/components/store/store';
import { useDispatch } from 'react-redux';
import { useToast } from '@/hooks/useToast';
import { useDebounce } from '@/hooks/useDebounce';

const createNft = () => {
  console.count('handleCreateNFT');
  const dispatch = useDispatch<AppDispatch>();
  // ================ state ======================
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    supply: '',
    startingBid: '',
    duration: '',
    file: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'Fixed' | 'Auction'>('Fixed');

  // ================ HOOKs ======================
  const toast = useToast();
  const fee = fatchMarketplaceFee();
  const debouncedName = useDebounce(formData.name, 600);
  const debouncedPrice = useDebounce(formData.price, 600);
  const debouncedBid = useDebounce(formData.startingBid, 600);
  // --------------------------- function -------------------

  const handleChange = useCallback((key: keyof typeof formData, value: string | File | null) => setFormData((pre) => ({ ...pre, [key]: value })),[]);


  const handleCreateNFT = useCallback(async () => {
    if (!isConnected) return;
    const { name, description, price, supply, startingBid, duration,file } = formData;
    setLoading(true);
    if (
      !file ||
      !name ||
      !description ||
      (activeTab === 'Fixed' ? !price || !supply : !startingBid || !duration)
    ) {
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      toast.info('Minting NFT... ⏳');
      const imageCID = await uploadToIPFS(file);
      if (!imageCID) throw new Error('Failed to upload image to IPFS');

      const tokenURI = await uploadMetadataToIPFS(name, description, imageCID);
      if (!tokenURI) throw new Error('Failed to generate metadata URI');

      await dispatch(
        createNFT({
          tokenURI,
          supply: activeTab == 'Fixed' ? parseFloat(supply) : 1,
          price: activeTab == 'Fixed' ? parseFloat(price) : parseFloat(startingBid),
          saleType: activeTab,
          auctionDuration: parseFloat(duration),
        }),
      ).unwrap();

      setFormData({
        name: "",
        description: "",
        price: "",
        supply: "",
        startingBid: "",
        duration: "",
        file: null,
      });
      setPreview(null);
      toast.success('NFT Minted Successfully! 🎨');
    } catch (error) {
      toast.error('Mint failed ❌');
    } finally {
      setLoading(false);
    }
  },[formData, activeTab, dispatch, isConnected, toast])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      handleChange("file",uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
    }
  }, [handleChange]);

  return (
    <div className="min-h-screen max-w-4xl mx-auto w-full flex flex-col items-center py-12 px-6">
      {!isConnected ? (
        <div className="flex flex-col items-center justify-center h-screen text-center">
          <h3 className="text-3xl font-bold text-white">Connect Your Wallet</h3>
          <p className="text-gray-400 mt-2">You need to connect your wallet to create an NFT.</p>
          <ConnectBtn />
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-extrabold text-white mb-2">Create Your NFT</h2>
          <p className="text-gray-400 mb-8">
            Multiple edition on <span className="text-[#00d1ff]">Ethereum</span>
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-8">
            {/* Left side form */}
            <div className="flex flex-col gap-6 md:col-span-2">
              {/* Wallet Status */}
              <div className="px-4 py-3 rounded-xl bg-[#0f1f33] border border-[#1e3350] flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <Image src="/eth.svg" width={50} height={50} alt="eth logo" fetchPriority="low" />
                  <div className="text-sm">
                    {address && <p className="font-bold text-white">{shortenAddress(address)}</p>}
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
                  preview ? 'flex justify-between gap-1 bg-[#0f1f33] h-full' : 'h-72'
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
                    <span className="px-6 py-3 bg-[#1e3350] rounded-lg">Upload File</span>
                  </label>
                )}
              </div>

              {/* SaleType  */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setActiveTab('Fixed')}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === 'Fixed' ? 'bg-[#00d1ff] text-black' : 'bg-[#1e3350]'
                  }`}
                >
                  Fixed Price
                </button>
                <button
                  onClick={() => setActiveTab('Auction')}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === 'Auction' ? 'bg-[#00d1ff] text-black' : 'bg-[#1e3350]'
                  }`}
                >
                  Auction
                </button>
              </div>

              {activeTab === 'Fixed' ? (
                <FixedNFTForm
                  value={{
                    price:formData.price,
                    fee,
                    supply:formData.supply,
                  }}
                  setValue={{
                    setPrice:(v:string)=>handleChange("price",v),
                    setSupply:(v:string)=>handleChange("supply",v),
                  }}
                />
              ) : (
                <AuctionNFTForm
                  value={{
                    startingBid:formData.startingBid,
                    duration:formData.duration,
                  }}
                  setValue={{
                    setStartingBid:(v:string)=>handleChange("startingBid",v),
                    setDuration:(v:string)=>handleChange("duration",v)
                  }}
                />
              )}

              <FormInput
                label="Name"
                placeholder='e.g. "Redeemable T-Shirt with logo"'
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <FormInput
                label="Description"
                placeholder='e.g. "After purchasing, you will receive a real T-Shirt"'
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
              <Button
                handleClick={handleCreateNFT}
                othercss="rounded-lg px-3 py-3 flex items-center justify-center gap-2"
                loading={loading}
                disable={loading}
                title={'Create NFT'}
              />
            </div>

            {/* Right side Preview */}
            <div className="hidden md:block top-6 h-fit stick">
            <PreviewNFT
                preview={preview}
                price={
                  activeTab === "Auction"
                    ? formData.startingBid
                    : formData.price
                }
                name={formData.name}
                activeTab={activeTab}
                supply={formData.supply}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default createNft;
