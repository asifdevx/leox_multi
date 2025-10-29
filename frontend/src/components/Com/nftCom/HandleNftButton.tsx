import Button from '@/components/ui/Button';
import { NFT } from '@/types';
import React, { useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';
type HandleNftButtonProps = {
  specificNft: NFT;
};
const HandleNftButton = ({ specificNft }: HandleNftButtonProps) => {
    console.count("HandleNftButton")
  const { address } = useAccount();
  const isOwner = useMemo(
    () => address?.toLowerCase() === specificNft?.seller,
    [address, specificNft?.seller],
  );

  const cancelListing = useCallback(() => {}, []);
  const cancelAuction = useCallback(() => {}, []);
  const openListModal = useCallback(() => {}, []);
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
        loading={disabled}
      />
    </div>
  );
};

export default HandleNftButton;
