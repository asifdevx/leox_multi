import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount } from 'wagmi';
import { notFound } from 'next/navigation';

import FormInput from '@/components/Com/HelperCom/FormInput';
import TimerDisplay from '@/components/Com/HelperCom/TimerDisplay';
import Button from '@/components/ui/Button';
import { bidToken, claimAuction, getBidHistory } from '@/reducer/BuySlice';
import { AppDispatch, RootState } from '@/components/store/store';
import { NFT } from '@/types';
import { cn } from '@/utils/cn';
import { ShortenPrecisionPrice } from '@/utils/ShortenPrecisionPrice';
import { formatEther, parseEther } from 'ethers';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import BidItem from '@/components/Com/HelperCom/BidItem';

const AuctionCollection = ({ nft }: { nft: NFT }) => {
  console.count('AuctionCollection items rendered');

  // ========== Hooks & Redux Setup ==========
  const dispatch = useDispatch<AppDispatch>();
  const { address } = useAccount();
  const { bidHistory, loading } = useSelector((state: RootState) => state.buyOrBid);

  // ========== Local State ==========
  const [bidAmount, setBidAmount] = useState('');
  const [isAuctionEnded, setIsAuctionEnded] = useState(Date.now() > nft.auctionEndTime * 1000);

  // ========== Destructure NFT ==========
  const { tokenId, seller, highestBid } = nft;
  const lowerSeller = seller.toLowerCase();
  const lowerAddress = address?.toLowerCase();

  if (!nft) notFound();

  // ========== Derived Data ==========
  const bids = useMemo(() => {
    const list = bidHistory?.[tokenId]?.[lowerSeller] || [];
    return list.slice().sort((a, b) => parseFloat(b.bid) - parseFloat(a.bid));
  }, [bidHistory, tokenId, lowerSeller]);

  const myBid = useMemo(() => {
    if (!lowerAddress) return null;
    return bids.find((b) => b.bidder.toLowerCase() === lowerAddress);
  }, [bids, lowerAddress]);

  const totalWei = useMemo(
    () => parseEther(bidAmount || '0') + parseEther(myBid?.bid.toString() || '0'),
    [bidAmount, myBid],
  );

  const handleAuctionEnd = useCallback(() => {
    setIsAuctionEnded(true);
  }, [ ]);

  const totalBidEth = useMemo(() => formatEther(totalWei), [totalWei]);

  // ========== Handlers ==========
  const handleBidChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');
    if ((value.match(/\./g) || []).length > 1) return;

    const parts = value.split('.');
    if (parts[1]?.length > 5) parts[1] = parts[1].slice(0, 5);
    value = parts.join('.');
    setBidAmount(value);
  }, []);

  const canClaim = myBid && !myBid.claim  || (lowerAddress === lowerSeller && !nft?.claimed);



  // ========== Handlers ==========
  const onPlaceBid = useCallback(async () => {
    console.log(tokenId, seller, Number(bidAmount), nft);

    if (!bidAmount || Number(bidAmount) <= 0) {
      alert('Enter a valid bid');
      return;
    }
    if (totalWei <= Number(highestBid)) {
      alert('Increase your bid');
      return;
    }
    await dispatch(
      bidToken({
        tokenId: Number(tokenId),
        seller,
        bidder: address!,
        bidAmount: Number(bidAmount),
      }),
    );
    setBidAmount('');
  }, [dispatch, tokenId, seller, address, bidAmount]);

  const onClaim = useCallback(async () => {
    await dispatch(claimAuction({ tokenId: Number(tokenId), seller }));
  }, [dispatch, tokenId, seller]);

  // ========== Effects ==========
  useEffect(() => {
    if (!tokenId || !seller) return;
    dispatch(getBidHistory({ tokenId, seller }));
  }, [dispatch, tokenId, seller]);



  // ========== Computed Auction States ==========

  
  const isSeller = useMemo(() => {
    const canBid = nft.seller == address?.toLowerCase();
    return canBid;
  }, [nft.seller, address]);

  const displayBid = useMemo(() => {
    const ethValue = Number(nft.highestBid) === 0 ? nft.price : formatEther(nft.highestBid);
    return ShortenPrecisionPrice(ethValue);
  }, [nft]);
  // ========== Render ==========
  return (
    <>
      {/* Auction Info */}
      <div className="bg-[#151c36] p-6 rounded-xl border border-purple-800/50 mb-8 shadow-xl">
        <p className="text-sm text-gray-400 uppercase font-medium mb-2">
          AUCTION {isAuctionEnded ? 'ENDED' : 'ENDS IN'}:
        </p>

        {!isAuctionEnded && (
          <TimerDisplay
            startTime={nft.auctionStartTime * 1000}
            endTime={nft.auctionEndTime * 1000}
            onAuctionEnd={handleAuctionEnd}
          />
        )}

        {/* Highest Bid Info */}
        <div className="text-white mb-4">
          <p>
            <span className="text-gray-400">
              {Number(nft.highestBid) == 0 ? 'Min Bid' : 'Highest Bid'}{' '}
            </span>
            {' : '}
            <span className="text-glow-purple font-bold">{displayBid} ETH</span>
          </p>
          <p>
            <span className="text-gray-400">Highest Bidder:</span>{' '}
            <span className="text-purple-400 break-words">{nft.highestBidder}</span>
          </p>
        </div>

        {/* Bid Input */}
        {!isAuctionEnded && !isSeller && (
          <>
            <FormInput
              label={myBid ? 'Increase Your Bid :' : 'Place a Bid:'}
              placeholder="Enter price"
              type="text"
              value={bidAmount}
              inputClass="my-3"
              icon="ETH"
              onChange={handleBidChange}
            />
            {Number(bidAmount) !== 0 && (
              <p className="text-white font-bold text-lg">
                Total: <span className="text-glow-purple">{totalBidEth} ETH</span>
              </p>
            )}
          </>
        )}
        {/* Action Button */}
        <Button
          title={
            isAuctionEnded ? (
              canClaim ? (
                loading ? (
                  <>
                    {' '}
                    <AiOutlineLoading3Quarters className="text-white animate-spin" /> "Claim"{' '}
                  </>
                ) : (
                  'CLAIM NFT'
                )
              ) : (
                'AUCTION ENDED'
              )
            ) : (
              'PLACE BID'
            )
          }
          loading={(isAuctionEnded && !canClaim) || loading}
          handleClick={isAuctionEnded ? onClaim : onPlaceBid}
          othercss={cn(
            'font-bold py-3 px-6 rounded-xl text-lg shadow-lg transition-all',
            isAuctionEnded
              ? canClaim
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white',
          )}
        />
      </div>

      {/* Bid History */}
      <div className="mt-6 bg-[#10172b] p-4 rounded-lg border border-purple-700/40 max-h-56 overflow-y-auto">
        <h3 className="text-lg font-semibold text-purple-400 mb-3">Bid History</h3>

        {loading && (
          <p className="text-gray-400 flex items-center gap-2">
            <AiOutlineLoading3Quarters className="animate-spin" /> Loading bids...
          </p>
        )}
        {!loading && bids.length === 0 && <p className="text-gray-500 text-sm">No bids yet.</p>}

        {bids.map((b, i) => {
          const isWinner =
            isAuctionEnded && b.bidder.toLowerCase() === nft.highestBidder.toLowerCase();
          return <BidItem key={i} bidder={b.bidder} bid={b.bid} isWinner={isWinner} />;
        })}
      </div>
    </>
  );
};

export default React.memo(AuctionCollection);
