import React, { useEffect, useState } from "react";
import {  Dialog } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";
import { GoCopy } from "react-icons/go";
import { FaExternalLinkAlt } from "react-icons/fa";
import Image from "next/image";
import { handleCopy } from "../../../utils/handleCopy";
import { WalletBalance } from "./WalletBalance";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useDispatch } from "react-redux";
import { getUserInfo } from "@/reducer/userSlice";
import AddUserName from "./AddUserName";
import Link from "next/link";
import ProfileIcon from "./ProfileIcon";
import { AppDispatch } from "@/components/store/store";
import { shortenAddress } from "@/utils/ShortenAddress";
import Button from "@/components/ui/Button";

const ConnectBtn: React.FC = () => {
  const { address, isConnected, isConnecting, isReconnecting, status } =
    useAccount();
  const { connectors, connectAsync } = useConnect();
  const dispatch = useDispatch<AppDispatch>();
  const { disconnect } = useDisconnect();
  const { symbol, formate } = WalletBalance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRejected, setUserRejected] = useState(false);
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);

  const metaMaskConnector = connectors.find((c) => c.name === "MetaMask");

  

  useEffect(() => {
    async function fatch() {
      if (address) {
        const data = await dispatch(getUserInfo({ address })).then(
          (res: any) => {
            const user = res.payload;
            console.log("userData",user);
            
            if (user?.isFirstTime) {
              console.log("true");
              setIsFirstTimeLogin(true);
            }
          }
        );
      }
    }
    fatch();
  }, [address]);

  const handleConnect = async (connector: any) => {
    if (isConnected) {
      setIsModalOpen(true);
      return;
    }
    if (isConnecting || isReconnecting) {
      setIsModalOpen(true);
      return;
    }
    setIsModalOpen(true);
    try {
      await connectAsync({ connector });

      setUserRejected(false);
    } catch (error: any) {
      if (error?.name === "ConnectorAlreadyConnectedError") {
        setIsModalOpen(true);
        setUserRejected(false);
        return;
      }
      if (error?.code === 4001 || error?.message?.includes("User rejected")) {
        setUserRejected(true);
      } else {
        setUserRejected(false);
        setIsModalOpen(false);
      }
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setIsModalOpen(false);
  };

  const title =
    isConnected && address ? shortenAddress(address) : "Connect";

  return (
    <div>
      {/* Main Button */}

      <Button
        title={title}
        handleClick={() => handleConnect(metaMaskConnector)}
        othercss="px-3 py-2 text-base md:text-lg rounded-lg"
      />

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
                        fetchPriority="high"
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

              {userRejected && !isConnected && (
                <div className="flex flex-col items-center gap-3 py-6">
                  <div className="relative">
                    <Image
                      src="/metamask.png"
                      width={64}
                      height={64}
                      fetchPriority="high"
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
                <ProfileIcon width={72} height={72} address={address}/>
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
                  <Link href="/items/owned">
                  <Button title="My NFTS" othercss="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-600 text-white hover:bg-gray-700 transition-all duration-200 shadow-md"
                  handleClick={()=>setIsModalOpen(false)}/>
                  </Link>
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
      {isFirstTimeLogin && (
       <AddUserName setIsFirstTimeLogin={setIsFirstTimeLogin} isFirstTimeLogin={isFirstTimeLogin} />
      )}
    </div>
  );
};

export default ConnectBtn;
