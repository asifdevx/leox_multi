import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import * as t from '@/types';
import FixedNFTForm from '../createCom/FixedNFTForm';
import AuctionNFTForm from '../createCom/AuctionNFTForm';
import { fatchMarketplaceFee } from '@/hooks/fatchMarketplaceFee';
import Button from '@/components/ui/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/components/store/store';
import { reSellNft,startAuctionNft } from '@/reducer/nftSlice';
import { useToast } from '@/hooks/useToast';
type ListInViewProps = {
  setIsModalOpen: (isModalOpen: boolean) => void;
  specificNft: t.NFT;
};

const ListInView = ({ setIsModalOpen, specificNft }: ListInViewProps) => {
  const dispatch = useDispatch<AppDispatch>();
  //  -----------------------------State ----------------------------------
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [duration, setDuration] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [resellLoading, setresellLoading] = useState<boolean>(false);
  const [priceError, setPriceError] = useState('');
  const [supplyError, setsupplyError] = useState('');
  const [activeTab, setActiveTab] = useState<'Fixed' | 'Auction'>('Fixed');
  //  -----------------------------Hooks ----------------------------------
  const fee = fatchMarketplaceFee();
  const toast =useToast();
  //  ----------------------------function ----------------------------------
  const handleMode = useCallback(() => setIsModalOpen(false), [setIsModalOpen]);
  const priceRequire = useCallback(() => {
    if (!Number(price)) setPriceError('Enter a price');
  }, [price,priceError]);
  const supplyRequire = useCallback(() => {
    if (!Number(quantity)) setsupplyError('Enter a price');
    if (Number(quantity) <= specificNft.remainingSupply) setsupplyError(`you have ${specificNft.remainingSupply}`);
  }, [quantity,supplyError]);

  const reSell = useCallback(() => {
    setresellLoading(true);

    if (!price || !quantity  ) {
      setresellLoading(false);
      toast.warning('please fill up all field');
      return;
    }
    try {
      const response = dispatch(
        reSellNft({
          tokenId: Number(specificNft.tokenId),
          quantity: Number(quantity),
          newPrice: Number(price),
        }),
      );
      setQuantity('');
      setPrice('');
      console.log('response', response);
    } catch (error) {
      console.log(error, 'relist failed');
    } finally {
      setresellLoading(false);
    }
  }, [price,quantity,resellLoading]);

  const startAuction = useCallback(() => {
    setresellLoading(true);

    if (!startingBid || !duration  ) {
      setresellLoading(false);
      toast.warning('please fill up all field');
      return;
    }
    try {
      const response = dispatch(
        startAuctionNft({
          tokenId: Number(specificNft.tokenId),
          minPrice:Number(startingBid),
          auctionDuration:Number(duration)
        }),
      );
      setDuration("");
      setStartingBid("");
      console.log('response', response);
    } catch (error) {
      console.log(error, 'relist failed');
    } finally {
      setresellLoading(false);
    }
  }, [startingBid,duration,resellLoading]);

  return (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-[#0b1a2a] to-[#15405c] p-6 rounded-2xl shadow-2xl max-w-md w-[90%] text-white"
      >
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
              price,
              fee,
              supply: quantity,
              supplyError,
              priceError,
            }}
            setValue={{
              setPrice,
              setSupply: setQuantity,
              priceRequire,
              supplyRequire,
            }}
          />
        ) : (
          <AuctionNFTForm
            value={{
              startingBid,
              duration,
            }}
            setValue={{
              setStartingBid,
              setDuration,
            }}
          />
        )}

        <div className="flex justify-end gap-3 mt-4">
          <Button
            title=" Cancel"
            handleClick={handleMode}
            othercss="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition"
          />

          <Button
            title="List"
            handleClick={activeTab === "Fixed" ? reSell :startAuction}
            othercss="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(ListInView);
