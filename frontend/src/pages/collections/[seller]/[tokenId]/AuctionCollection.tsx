
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { notFound } from "next/navigation";
import FormInput from "@/components/Com/HelperCom/FormInput";
import TimerDisplay from "@/components/Com/HelperCom/TimerDisplay";
import Button from "@/components/ui/Button";
import { bidToken, claimAuction, getBidHistory } from "@/reducer/BuySlice";
import { AppDispatch, RootState } from "@/components/store/store";
import { NFT } from "@/types";
import { cn } from "@/utils/cn";
import { ShortenPrecisionPrice } from "@/utils/ShortenPrecisionPrice";
import { formatEther, parseEther } from "ethers";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import BidItem from "@/components/Com/HelperCom/BidItem";

const AuctionCollection = ({ nft }: { nft: NFT }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { address } = useAccount();
  const { bidHistory, loading } = useSelector(
    (state: RootState) => state.buyOrBid
  );

  const [bidAmount, setBidAmount] = useState("");
  const [isAuctionEnded, setIsAuctionEnded] = useState(
    Date.now() > nft.auctionEndTime * 1000
  );

  if (!nft) notFound();

  const { tokenId, seller, highestBid } = nft;
  const lowerSeller = seller.toLowerCase();
  const lowerAddress = address?.toLowerCase();

  const bids = useMemo(() => {
    const list = bidHistory?.[tokenId]?.[lowerSeller] || [];
    return list.slice().sort((a, b) => parseFloat(b.bid) - parseFloat(a.bid));
  }, [bidHistory, tokenId, lowerSeller]);

  const myBid = useMemo(() => {
    if (!lowerAddress) return null;
    return bids.find((b) => b.bidder.toLowerCase() === lowerAddress);
  }, [bids, lowerAddress]);

  const totalWei = useMemo(
    () => parseEther(bidAmount || "0") + parseEther(myBid?.bid.toString() || "0"),
    [bidAmount, myBid]
  );

  const handleAuctionEnd = useCallback(() => setIsAuctionEnded(true), []);
  const totalBidEth = useMemo(() => formatEther(totalWei), [totalWei]);

  const handleBidChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/[^0-9.]/g, "");
      if ((value.match(/\./g) || []).length > 1) return;
      const parts = value.split(".");
      if (parts[1]?.length > 5) parts[1] = parts[1].slice(0, 5);
      value = parts.join(".");
      setBidAmount(value);
    },
    []
  );

  const canClaim =
    (myBid && !myBid.claim) ||
    (lowerAddress === lowerSeller && !nft?.claimed);

  const onPlaceBid = useCallback(async () => {
    if (!bidAmount || Number(bidAmount) <= 0) {
      alert("Enter a valid bid");
      return;
    }
    if (totalWei <= Number(highestBid)) {
      alert("Increase your bid");
      return;
    }
    await dispatch(
      bidToken({
        tokenId: Number(tokenId),
        seller,
        bidder: address!,
        bidAmount: Number(bidAmount),
      })
    );
    setBidAmount("");
  }, [dispatch, tokenId, seller, address, bidAmount]);

  const onClaim = useCallback(async () => {
    await dispatch(claimAuction({ tokenId: Number(tokenId), seller }));
  }, [dispatch, tokenId, seller]);

  useEffect(() => {
    if (!tokenId || !seller) return;
    dispatch(getBidHistory({ tokenId, seller }));
  }, [dispatch, tokenId, seller]);

  const isSeller = useMemo(
    () => nft.seller == address?.toLowerCase(),
    [nft.seller, address]
  );

  const displayBid = useMemo(() => {
    const ethValue =
      Number(nft.highestBid) === 0 ? nft.price : formatEther(nft.highestBid);
    return ShortenPrecisionPrice(ethValue);
  }, [nft]);

  return (
    <>
      {/* Auction Info Card */}
      <div className="relative bg-[#151c36]/80 backdrop-blur-xl border border-[#6934d3]/40 rounded-2xl shadow-[0_0_25px_rgba(105,52,211,0.3)] p-6 md:p-8 mb-8 transition-all duration-300 hover:shadow-[0_0_35px_rgba(105,52,211,0.5)]">
        {/* Header */}
        <div className="flex flex-col md:items-center md:justify-between mb-4">
          <p className="text-sm text-gray-400 uppercase tracking-wide font-semibold">
            Auction {isAuctionEnded ? "Ended" : "Ends In"}:
          </p>
          {!isAuctionEnded && (
            <TimerDisplay
              startTime={nft.auctionStartTime * 1000}
              endTime={nft.auctionEndTime * 1000}
              onAuctionEnd={handleAuctionEnd}
            />
          )}
        </div>

        {/* Highest Bid */}
        <div className="bg-[#1f2847]/60 border border-[#6934d3]/30 rounded-xl p-4 mb-6 space-y-1">
          <p className="text-gray-400 text-sm">
            {Number(nft.highestBid) === 0 ? "Min Bid" : "Highest Bid"}:
          </p>
          <h2 className="text-2xl font-bold text-glow-purple">
            {displayBid} ETH
          </h2>
          <p className="text-gray-400 text-xs">
            Highest Bidder:{" "}
            <span className="text-purple-400 break-all">
              {nft.highestBidder}
            </span>
          </p>
        </div>

        {/* Bid Input */}
        {!isAuctionEnded && !isSeller && (
          <div className="mb-6">
            <FormInput
              label={myBid ? "Increase Your Bid:" : "Place a Bid:"}
              placeholder="Enter amount"
              type="text"
              value={bidAmount}
              inputClass="my-3"
              icon="ETH"
              onChange={handleBidChange}
            />
            {Number(bidAmount) !== 0 && (
              <p className="text-white font-semibold text-lg">
                Total:{" "}
                <span className="text-glow-purple">{totalBidEth} ETH</span>
              </p>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          title={
            isAuctionEnded
              ? canClaim
                ? loading
                  ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin text-white" />{" "}
                      Claiming...
                    </>
                  )
                : "CLAIM NFT"
              : "AUCTION ENDED"
              : "PLACE BID"
          }
          loading={(isAuctionEnded && !canClaim) || loading}
          handleClick={isAuctionEnded ? onClaim : onPlaceBid}
          othercss={cn(
            "w-full py-3 text-lg font-bold rounded-xl transition-all duration-300 shadow-lg",
            isAuctionEnded
              ? canClaim
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white"
          )}
        />
      </div>

      {/* Bid History */}
      <div className="bg-[#10172b]/80 backdrop-blur-xl border border-[#6934d3]/40 rounded-2xl shadow-[0_0_25px_rgba(105,52,211,0.2)] p-6 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-[#6934d3]/40 scrollbar-track-transparent">
        <h3 className="text-lg font-semibold text-purple-400 mb-3">Bid History</h3>

        {loading && (
          <p className="text-gray-400 flex items-center gap-2">
            <AiOutlineLoading3Quarters className="animate-spin" /> Loading bids...
          </p>
        )}

        {!loading && bids.length === 0 && (
          <p className="text-gray-500 text-sm">No bids yet.</p>
        )}

        {bids.map((b, i) => {
          const isWinner =
            isAuctionEnded && b.bidder.toLowerCase() === nft.highestBidder.toLowerCase();
          return (
            <BidItem
              key={i}
              bidder={b.bidder}
              bid={b.bid}
              isWinner={isWinner}
            />
          );
        })}
      </div>
    </>
  );
};

export default React.memo(AuctionCollection);
