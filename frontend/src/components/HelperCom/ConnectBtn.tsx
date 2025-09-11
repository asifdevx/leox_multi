import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortenAddress } from "../ui/ShortenAddress";
import { IoMdClose } from "react-icons/io";
import { GoCopy } from "react-icons/go";
import { FaExternalLinkAlt } from 'react-icons/fa';
import blockies from "ethereum-blockies";
import Image from "next/image";

const ConnectBtn = () => {
  const { disconnectAsync } = useDisconnect();

  const { address, isConnected } = useAccount();
  const { connectors, connectAsync } = useConnect();
  if (!address) return;

  const icon = blockies
    .create({ seed: address.toLowerCase(), size: 8, scale: 4 })
    .toDataURL();


  const metaMaskConnector = connectors.find(
    (connector) => connector.name === "MetaMask"
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async (connector: any) => {
    setIsLoading(true);
    try {
      await connectAsync({ connector });
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleDisconnect =  async() => {
    try {
      await  disconnectAsync();
    } catch (error) {
      console.error("Disconnection faild:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleCopy = () =>{
    if (!address) return;

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(address)
      .then(() => console.log("Copied!"))
      .catch(() => fallbackCopy(address));
  } else {
    fallbackCopy(address);
  }
  };


  return (
    <div>
      {isConnected ? (
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue text-black rounded text-sm"
          >
            {shortenAddress(address!)}
          </button>
        </div>
      ) : (
        <button
          onClick={() => metaMaskConnector && handleConnect(metaMaskConnector)}
          disabled={isLoading}
          className="px-4 py-2 bg-blue text-black rounded text-sm"
        >
          {isLoading ? "Connecting..." : "Connect wallet"}
        </button>
      )}

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-70"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full border border-[#d9c6c6]/30 max-w-md text-white rounded-xl bg-[#000] p-6 ">
            <div className="flex flex-col items-center gap-1">
              {isConnected ? (
                <>
                  <div className="flex w-full items-end justify-end">< IoMdClose className="font-bold text-xl" /></div>
                  <div className="p-2 bg-[#2c2a2a] rounded-full">
                    <Image src={icon} width={70} height={70} alt="identicon" className="object-cover rounded-full" />
                  </div>
                  <div className="flex gap-2 items-center justify-center">
                    <p className="text-2xl font-extrabold">
                      {shortenAddress(address!)}
                    </p>
                    <GoCopy className="text-white/80" onClick={handleCopy}/>
                  </div>
                  <p className="text-white/60">0.000 BNB</p>
                  <button
                    onClick={() => console.log('Clicked!')}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-gray-600 text-white  hover:bg-gray-700 hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    <FaExternalLinkAlt className="w-5 h-5" />
                    Block Explorer
                  </button>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDisconnect}
                      className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                      Disconnect
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src="/metamask.png"
                    alt="MetaMask Logo"
                    className="w-16 h-16 mb-4"
                  />
                  <Dialog.Title className="text-lg font-medium text-gray">
                    Connect Wallet
                  </Dialog.Title>
                  <p className="text-gray text-center mt-2">
                    Accept connection request in your wallet
                  </p>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-4 px-4 py-2 bg-blue text-black rounded"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};


const fallbackCopy = (text: string) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  console.log("Copied with fallback!");
};

export default ConnectBtn;
