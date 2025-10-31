import React, { useCallback, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { AnimatePresence } from 'framer-motion';

import Button from '@/components/ui/Button';
import { NFT } from '@/types';
import ListInView from "./ListInView";
type HandleNftButtonProps = {
  specificNft: NFT;
};
const HandleNftButton = ({ specificNft }: HandleNftButtonProps) => {
    console.count("HandleNftButton")
  const { address } = useAccount();
  const [isModalOpen,setIsModalOpen] = useState<boolean>(false);
  
  const isOwner = useMemo(() => address?.toLowerCase() === specificNft?.seller, [address, specificNft?.seller]);
  
  const cancelListing = useCallback(() => {}, []);
  const cancelAuction = useCallback(() => {}, []);
  const openListModal = useCallback(() =>setIsModalOpen(true) , [isModalOpen]);
  const goToMarketplace = useCallback(() => {}, []);

  const getButtonProps = () => {
    if (!specificNft) return { title: 'Loading...', disabled: true };
    const { isListed, saleType } = specificNft;

    if (isOwner) {
      if (isListed) {
        if (saleType === 0) return { title: 'Cancel Listing', action: cancelListing };
        if (saleType === 1) return { title: 'Cancel Auction', action: cancelAuction };
      } else {
        return { title: 'List NFT', action: openListModal };
      }
    }

    if (!isOwner) {
      if (isListed) {
        if (saleType === 0) return { title: 'Buy Now', action: goToMarketplace };
        if (saleType === 1) return { title: 'Place Bid', action: goToMarketplace };
      } else {
        return { title: 'Not Listed', action: null, disabled: true };
      }
    }

    return { title: 'Unavailable', disabled: true };
  };

  const { title, action, disabled } = getButtonProps();
  return (
    <div className="mt-4">
      <Button
        title={title}
        handleClick={action || (() => {})}
        othercss="w-full"
        disable={disabled!}
        
        
      />
      <AnimatePresence mode="wait">
  {isModalOpen && (
    <ListInView setIsModalOpen={setIsModalOpen} specificNft={specificNft}/>
  )}
</AnimatePresence>

    </div>
  );
};

export default HandleNftButton;



