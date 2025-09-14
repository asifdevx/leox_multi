import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortenAddress } from "../ui/ShortenAddress";
import { IoMdClose } from "react-icons/io";
import { GoCopy } from "react-icons/go";
import { FaExternalLinkAlt } from "react-icons/fa";
import blockies from "ethereum-blockies";
import Image from "next/image";
import { handleCopy } from "./handleCopy";
import { WalletBalance } from "./WalletBalance";

const ConnectBtn: React.FC = () => {
  const {
    address,
    isConnected,
    isConnecting,
    isReconnecting,
  } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { symbol, formate } = WalletBalance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRejected, setUserRejected] = useState(false);

  const metaMaskConnector = connectors.find((c) => c.name === "MetaMask");

  const icon =
    address &&
    blockies
      .create({ seed: address.toLowerCase(), size: 8, scale: 4 })
      .toDataURL();

  const handleConnect = async (connector: any) => {
    if (isConnected) {
      console.log("Already connected");
      setIsModalOpen(true);
      return;
    }

    try {
      setIsModalOpen(true);
      await connectAsync({ connector });
      setIsModalOpen(false);
      setUserRejected(false);
    } catch (error: any) {
      if (error?.name === "ConnectorAlreadyConnectedError") {
        console.warn("Already connected, skipping connectAsync");
        setIsModalOpen(true);
        return;
      }

      if (error?.message?.includes("User rejected")) {
        console.log("user rejected");

        setUserRejected(true);
        setIsModalOpen(true);
      } else {
        setUserRejected(false);
        setIsModalOpen(false);
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectAsync();
    } catch (err) {
      console.error("Disconnection failed:", err);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      {/* Main Button */}
      <button
        onClick={() =>
          isConnected ? setIsModalOpen(true) : handleConnect(metaMaskConnector)
        }
        className="px-4 py-2 bg-blue text-black rounded text-sm"
      >
        {isConnected && address ? shortenAddress(address) : "connect Wallet"}
      </button>

      {/* Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setUserRejected(false);
        }}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-70"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md text-white rounded-xl border border-[#d9c6c6]/30 bg-black p-6">
            <div className="flex flex-col items-center gap-4">
              {/* 🔄 Connecting */}
              {(isConnecting || isReconnecting) &&
                !userRejected &&
                !isConnected && (
                  <div className="flex flex-col items-center gap-4 py-6">
                    <img
                      src="/metamask.png"
                      className="w-16 h-16 animate-pulse"
                      alt="MetaMask"
                    />
                    <p className="text-lg font-semibold">
                      Continue in MetaMask
                    </p>
                    <p className="text-sm text-gray-400">
                      Accept connection request in the wallet
                    </p>
                    <button
                      onClick={() => handleConnect(metaMaskConnector)}
                      className="mt-4 px-4 py-2 bg-blue text-white rounded-lg"
                    >
                      Try again
                    </button>
                  </div>
                )}

              {/* ❌ User Rejected */}
              {userRejected && !isConnected && (
                <div className="flex flex-col items-center gap-4 py-6">
                  <div className="relative">
                    <img
                      src="/metamask.png"
                      className="w-16 h-16 relative"
                      alt="MetaMask"
                    />
                    <span className="absolute -bottom-1 right-0 text-red-500 text-2xl">
                      ✖
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-red-500">
                    Connection declined
                  </p>
                  <p className="text-sm text-gray-400">
                    You rejected the request in MetaMask.
                  </p>
                  <button
                    onClick={() => handleConnect(metaMaskConnector)}
                    className="mt-4 px-4 py-2 bg-blue text-white rounded-lg"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* ✅ Connected */}
              {isConnected && address && (
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
                  <div className="flex gap-2 items-center justify-center">
                    <p className="text-2xl font-extrabold">
                      {shortenAddress(address)}
                    </p>
                    <GoCopy
                      className="text-white/80 cursor-pointer"
                      onClick={() => handleCopy(address)}
                    />
                  </div>
                  <p className="text-white/60">
                    {formate} {symbol}
                  </p>
                  <button
                    onClick={() => console.log("Open explorer")}
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
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ConnectBtn;
