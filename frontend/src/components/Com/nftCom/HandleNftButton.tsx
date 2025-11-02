import React, { useCallback, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { AnimatePresence } from 'framer-motion';

import Button from '@/components/ui/Button';
import { NFT } from '@/types';
import ListInView from './ListInView';
import { useRouter } from 'next/router';
import { useToast } from '@/hooks/useToast';
import { useDispatch } from 'react-redux';
import { claimAuction } from '@/reducer/BuySlice';
import { AppDispatch } from '@/components/store/store';
import { unlist } from '@/reducer/nftSlice';
type HandleNftButtonProps = {
  specificNft: NFT;
};
const HandleNftButton = ({ specificNft }: HandleNftButtonProps) => {
  console.count('HandleNftButton');
  const router = useRouter();
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const { address } = useAccount();

  const { tokenId, seller, isListed, saleType, auctionEndTime } = specificNft;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const isOwner = useMemo(() => address?.toLowerCase() === seller, [address, seller]);

  const cancelListing = useCallback(async () => {
    await dispatch(unlist({ tokenId: Number(tokenId), seller: seller.toLowerCase() }));
    toast.success('NFT unListed!');
  }, []);
  const openListModal = useCallback(() => setIsModalOpen(true), [isModalOpen]);
  const goToMarketplace = useCallback(() => {
    router.push(`/collections/${seller}/${tokenId}`);
  }, []);

  const onClaim = useCallback(async () => {
    await dispatch(claimAuction({ tokenId: Number(tokenId), seller: seller.toLowerCase() }));
    toast.success('NFT Claimed!');
  }, [dispatch, tokenId, seller, toast]);

  const AuctionEnd = useMemo(() => Date.now() > auctionEndTime * 1000, [auctionEndTime]);

  const getButtonProps = useCallback(() => {
    if (!specificNft) return { title: 'Loading...', disabled: true };

    if (isOwner) {
      if (!isListed) return { title: 'List NFT', action: openListModal };
      if (isListed) {
        if (saleType === 0) return { title: 'Cancel Listing', action: cancelListing };
        if (saleType === 1)
          return AuctionEnd
            ? { title: 'Claim', action: onClaim }
            : { title: 'Wait for end', disabled: true };
      }
    }
    if (isListed) {
      if (saleType === 0) return { title: 'Buy Now', action: goToMarketplace };
      if (saleType === 1) return { title: 'Place Bid', action: goToMarketplace };
    }
    return { title: 'Not Listed', action: null, disabled: true };
  }, [specificNft, isOwner, isListed, isListed, AuctionEnd, saleType]);

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
        {isModalOpen && <ListInView setIsModalOpen={setIsModalOpen} specificNft={specificNft} />}
      </AnimatePresence>
    </div>
  );
};

export default HandleNftButton;
