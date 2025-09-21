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
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
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
        setIsModalOpen(true);
        return;
      }
      if (error?.message?.includes("User rejected")) {
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
        className="px-5 py-2 bg-gradient-to-r from-blueGradientStart to-blueGradientEnd text-white rounded-lg font-semibold text-sm shadow-md hover:scale-105 transition-transform duration-200"
      >
        {isConnected && address ? shortenAddress(address) : "Connect Wallet"}
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
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-gray-900 rounded-xl border border-gray-700 p-6 shadow-2xl transform transition-all duration-300">
            <div className="flex flex-col items-center gap-2">
              {/* 🔄 Connecting */}
              {(isConnecting || isReconnecting) &&
                !userRejected &&
                !isConnected && (
                  <div className="flex flex-col items-center gap-3 py-6">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <div className="absolute w-full h-full rounded-full border-4 border-blueGradientStart border-t-transparent animate-spin" />

                      <Image
                        src="/metamask.png"
                        width={55}
                        height={54}
                        alt="MetaMask"
                        className="animate-pulse pointer-events-none"
                      />
                    </div>
                    <p className="text-xl font-semibold text-white">
                      Continue in MetaMask
                    </p>
                    <p className="text-sm text-gray-400 text-center">
                      Accept the connection request in your wallet to proceed.
                    </p>
                    <button
                      onClick={() => handleConnect(metaMaskConnector)}
                      className="mt-4 px-6 py-2 bg-blueGradientStart rounded-lg font-medium text-white hover:bg-blueGradientEnd transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                )}

              {/* ❌ User Rejected */}
              {userRejected && !isConnected && (
                <div className="flex flex-col items-center gap-3 py-6">
                  <div className="relative">
                    <Image
                      src="/metamask.png"
                      width={64}
                      height={64}
                      alt="MetaMask"
                    />
                    <span className="absolute -bottom-2 right-0 text-red-500 text-3xl">
                      ✖
                    </span>
                  </div>
                  <p className="text-xl font-semibold text-red-500">
                    Connection Declined
                  </p>
                  <p className="text-sm text-gray-400 text-center">
                    You rejected the request in MetaMask.
                  </p>
                  <button
                    onClick={() => handleConnect(metaMaskConnector)}
                    className="mt-4 px-6 py-2 bg-blue-600 rounded-lg font-medium text-white hover:bg-blueGradientEnd transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* ✅ Connected */}
              {isConnected && address && (
                <>
                  <div className="flex w-full justify-end">
                    <IoMdClose
                      className="text-white/70 text-2xl cursor-pointer hover:text-white transition-colors"
                      onClick={() => setIsModalOpen(false)}
                    />
                  </div>
                  <div className="p-2 bg-gray-800 rounded-full">
                    <Image
                      src={icon!}
                      width={72}
                      height={72}
                      alt="Identicon"
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-white">
                      {shortenAddress(address)}
                    </p>
                    <GoCopy
                      className="text-white/60 cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleCopy(address)}
                    />
                  </div>
                  <p className="text-gray-400">
                    {formate} {symbol}
                  </p>
                  <button
                    onClick={() => console.log("Open explorer")}
                    className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-600 text-white hover:bg-gray-700 transition-all duration-200 shadow-md"
                  >
                    <FaExternalLinkAlt className="w-5 h-5" />
                    Block Explorer
                  </button>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleDisconnect}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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
