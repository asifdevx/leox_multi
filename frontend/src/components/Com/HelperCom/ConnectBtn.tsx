import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { IoMdClose } from 'react-icons/io';
import { GoCopy } from 'react-icons/go';
import { FaExternalLinkAlt } from 'react-icons/fa';
import Image from 'next/image';
import { handleCopy } from '../../../utils/handleCopy';
import { WalletBalance } from './WalletBalance';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useDispatch } from 'react-redux';
import { getUserInfo } from '@/reducer/userSlice';
import AddUserName from './AddUserName';
import Link from 'next/link';
import ProfileIcon from './ProfileIcon';
import { AppDispatch } from '@/components/store/store';
import { shortenAddress } from '@/utils/ShortenAddress';
import Button from '@/components/ui/Button';

const ConnectBtn: React.FC = () => {
  console.count('ConnectBtn');
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const dispatch = useDispatch<AppDispatch>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRejected, setUserRejected] = useState(false);
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);

  const metaMaskConnector = useMemo(
    () => connectors.find((c) => c.name === 'MetaMask'),
    [connectors],
  );

  useEffect(() => {
    if (!address) return;
    dispatch(getUserInfo({ address })).then((res: any) => {
      const user = res.payload;
      if (user?.isFirstTime) setIsFirstTimeLogin(true);
    });
  }, [address, dispatch]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setUserRejected(false);
  }, [isModalOpen, userRejected]);

  const handleConnect = useCallback(async () => {
    if (!metaMaskConnector) {
      return 'not found';
    }
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
      await connectAsync({ connector: metaMaskConnector });

      setUserRejected(false);
    } catch (error: any) {
      if (error?.name === 'ConnectorAlreadyConnectedError') {
        setIsModalOpen(true);
        setUserRejected(false);
        return;
      }
      if (error?.code === 4001 || error?.message?.includes('User rejected')) {
        setIsModalOpen(true);
        setUserRejected(true);
      } else {
        setUserRejected(false);
        setIsModalOpen(false);
      }
    } finally {
      setIsModalOpen(false);
      setUserRejected(false);

    }
  }, [
    metaMaskConnector,
    connectAsync,
    isConnected,
    isConnecting,
    isReconnecting,
    setIsModalOpen,
    userRejected,
  ]);

  const title = useMemo(
    () => (isConnected && address ? shortenAddress(address) : 'Connect'),
    [isConnected, address],
  );

  return (
    <>
      {/* Main Button */}

      <Button
        title={title}
        handleClick={handleConnect}
        disable={isConnecting || isReconnecting}
        othercss="px-3 py-2 text-base md:text-lg rounded-lg"
      />

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={closeModal}>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <Dialog.Panel className="w-full max-w-md bg-gray-900 rounded-xl border border-gray-700 p-6 shadow-2xl transition-all duration-300">
            {/* Top close */}
            {isConnected && (
              <div className="flex justify-end">
                <IoMdClose
                  className="text-white/70 text-2xl cursor-pointer hover:text-white"
                  onClick={closeModal}
                />
              </div>
            )}

            {/* Dynamic content */}
            {(isConnecting || isReconnecting) && !isConnected && !userRejected && (
              <ConnectingUI handleConnect={handleConnect} />
            )}

            {userRejected && !isConnected && <RejectUI handleConnect={handleConnect} />}

            {isConnected && address && <ConnectedUI closeModal={closeModal} address={address} />}
          </Dialog.Panel>
        </div>
      </Dialog>

      {isFirstTimeLogin && (
        <AddUserName
          setIsFirstTimeLogin={setIsFirstTimeLogin}
          isFirstTimeLogin={isFirstTimeLogin}
        />
      )}
    </>
  );
};

export default React.memo(ConnectBtn);

export const ConnectingUI = React.memo(({ handleConnect }: { handleConnect: () => void }) => {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute w-full h-full rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        <Image src="/metamask.png" width={55} height={54} alt="MetaMask" />
      </div>
      <p className="text-xl font-semibold text-white">Continue in MetaMask</p>
      <p className="text-sm text-gray-400 text-center">
        Accept the connection request in your wallet to proceed.
      </p>
      <button
        onClick={handleConnect}
        className="mt-4 px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition-colors"
      >
        Retry
      </button>
    </div>
  );
});

export const RejectUI = React.memo(({ handleConnect }: { handleConnect: () => void }) => {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <Image src="/metamask.png" width={64} height={64} alt="MetaMask" />
      <p className="text-xl font-semibold text-red-500">Connection Declined</p>
      <p className="text-sm text-gray-400 text-center">You rejected the request in MetaMask.</p>
      <button
        onClick={handleConnect}
        className="mt-4 px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
});

export const ConnectedUI = React.memo(
  ({ closeModal, address }: { closeModal: () => void; address: string }) => {
    const { disconnect } = useDisconnect();

    const { symbol, formate } = WalletBalance();

    const handleDisconnect = useCallback(() => {
      disconnect();
      closeModal();
    }, [disconnect, closeModal]);

    return (
      <div className="flex flex-col items-center gap-2">
        <ProfileIcon width={72} height={72} address={address} />
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-white">{shortenAddress(address)}</p>
          <GoCopy
            className="text-white/60 cursor-pointer hover:text-white"
            onClick={() => handleCopy(address)}
          />
        </div>
        <p className="text-gray-400">
          {formate} {symbol}
        </p>

        <Link href="/items/owned" onClick={closeModal}>
          <Button
            title="My NFTs"
            othercss="mt-3 px-4 py-2 rounded-xl border border-gray-600 text-white hover:bg-gray-700"
          />
        </Link>

        <button className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-600 text-white hover:bg-gray-700">
          <FaExternalLinkAlt className="w-5 h-5" />
          Block Explorer
        </button>

        <div className="flex gap-4 mt-4 w-full">
          <button
            onClick={closeModal}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Close
          </button>
          <button
            onClick={handleDisconnect}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  },
);
