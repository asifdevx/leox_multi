import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortenAddress } from "../ui/ShortenAddress";
import { IoMdClose } from "react-icons/io";
import { GoCopy } from "react-icons/go";
import { FaExternalLinkAlt } from 'react-icons/fa';
import blockies from "ethereum-blockies";
import Image from "next/image";
import { handleCopy } from "./handleCopy";

const ConnectBtn = () => {
  const { disconnectAsync } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { connectors, connectAsync } = useConnect();

  const icon =
    address &&
    blockies
      .create({ seed: address.toLowerCase(), size: 8, scale: 4 })
      .toDataURL();


  const metaMaskConnector = connectors.find(
    (connector) => connector.name === "MetaMask"
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  useEffect(() => {
    console.log(status);
  }, [status]);

  const handleConnect = async (connector: any) => {
    if (status === "pending") {
      // Already trying to connect
      console.log("Connection request is already active. Please check your wallet.");
      return;
    }

    setStatus("pending");
    setIsModalOpen(true);
    try {
      await connectAsync({ connector });
      setStatus("success");
      setIsModalOpen(false);
    } catch (error: unknown) {
      console.error("Connection failed:", error);

      if (error instanceof Error) {
        if (error.message.includes("User rejected")) {
          setStatus("error");
          setIsModalOpen(true);
        } else {
          setStatus("idle");
          setIsModalOpen(false);
        }
      } else {
        setStatus("error");
        setIsModalOpen(true);
      }
    }
  };



  const handleDisconnect = async () => {
    try {
      await disconnectAsync();
      setStatus("idle");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Disconnection failed:", error);
      setStatus("error");

    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div>

      <button
        onClick={() => isConnected ? setIsModalOpen(true) : metaMaskConnector && handleConnect(metaMaskConnector)}
        disabled={status === "pending"}
        className="px-4 py-2 bg-blue text-black rounded text-sm"
      >
        {status === "pending"
          ? "Connecting..."
          : status === "idle" || status === "error"
            ? "Connect Wallet" 
            : status==="success" && address && shortenAddress(address!)}
      </button>


      <Dialog
        open={isModalOpen}
        onClose={() => {
          if (status !== "pending" ) {
            setIsModalOpen(false);
          }}}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black bg-opacity-70" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md text-white rounded-xl border border-[#d9c6c6]/30 bg-black p-6">
            <div className="flex flex-col items-center gap-4">
              {/* 🔄 Loading State */}
              {status === "pending" ? (
                <div className="flex flex-col items-center gap-4 py-6">
                  <img src="/metamask.png" className="w-16 h-16 animate-pulse" alt="MetaMask" />
                  <p className="text-lg font-semibold">Continue in MetaMask</p>
                  <p className="text-sm text-gray-400">Accept connection request in the wallet</p>
                 
                 <div className="w-full flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      metaMaskConnector && handleConnect(metaMaskConnector);
                    setStatus("error"); }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Try again
                  </button>
                  </div> 
                </div>
              ) : status == "success" && address  && (
                // ✅ Connected State
                <>
                  <div className="flex w-full items-end justify-end">
                    <IoMdClose
                      className="font-bold text-xl cursor-pointer"
                      onClick={() => setIsModalOpen(false)}
                    />
                  </div>
                  <div className="p-2 bg-[#2c2a2a] rounded-full">
                    <Image
                      src={icon!}
                      width={70}
                      height={70}
                      alt="identicon"
                      className="object-cover rounded-full"
                    />
                  </div>
                  { address &&

                    <div className="flex gap-2 items-center justify-center">
                    <p className="text-2xl font-extrabold">
                      {shortenAddress(address!)}
                    </p>
                    <GoCopy
                      className="text-white/80 cursor-pointer"
                      onClick={() => handleCopy(address!)}
                      />
                  </div>
                    }
                  <p className="text-white/60">0.000 BNB</p>
                  <button
                    onClick={() => console.log("Clicked!")}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-gray-600 text-white hover:bg-gray-700 hover:scale-105 transition-all duration-200 shadow-lg"
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
              )}
              {status == "error" && (
                <div className="flex flex-col items-center gap-4 py-6">
                  <img src="/metamask.png" className="w-16 h-16 relative" alt="MetaMask" />
                  <span className="absolute -bottom-1 text-red-500 text-2xl">✖</span>
                  <p className="text-lg font-semibold text-red-500">Connection declined</p>
                  <p className="text-sm text-gray-400">
                    Connection can be declined if a previous request is still active
                  </p>
                  <button
                    onClick={() => metaMaskConnector && handleConnect(metaMaskConnector)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

    </div>
  );
};

export default ConnectBtn;
