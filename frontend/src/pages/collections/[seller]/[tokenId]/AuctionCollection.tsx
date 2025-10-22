import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { notFound } from "next/navigation";

import FormInput from "@/components/HelperCom/FormInput";
import TimerDisplay from "@/components/HelperCom/TimerDisplay";
import Button from "@/components/ui/Button";
import { bidToken, claimAuction, getBidHistory } from "@/reducer/BuySlice";
import { AppDispatch, RootState } from "@/components/store/store";
import { NFT } from "@/types";
import { cn } from "@/utils/cn";
import { ShortenPrecisionPrice } from "@/utils/ShortenPrecisionPrice";
import { formatEther, parseEther } from "ethers";

const AuctionCollection = ({ nft }: { nft: NFT }) => {
  // ========== Hooks & Redux Setup ==========
  const dispatch = useDispatch<AppDispatch>();
  const { address } = useAccount();
  const { bidHistory, loading } = useSelector(
    (state: RootState) => state.buyOrBid
  );

  // ========== Local State ==========
  const [bidAmount, setBidAmount] = useState("");

  // ========== Destructure NFT ==========
  const { tokenId, seller } = nft;
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
    return bids.find((b) => b.bidder.toLowerCase() === lowerAddress) || null;
  }, [bids, lowerAddress]);

  const totalWei =
    parseEther((bidAmount || "0").toString()) +
    parseEther((myBid?.bid || "0").toString());

  const totalBidEth = formatEther(totalWei);

  // ========== Handlers ==========
  const onPlaceBid = useCallback(() => {
    if (!bidAmount || Number(bidAmount) <= 0) {
      alert("Enter a valid bid");
      return;
    }
    const highest = Number(nft.highestBid);

    if (totalWei <= highest) {
      alert("Increase your bid");
      return;
    }
    try {
      dispatch(
        bidToken({
          tokenId: Number(tokenId),
          seller,
          bidder: address!,
          bidAmount: Number(bidAmount),
        })
      );
      setBidAmount("");
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, tokenId, seller, address, bidAmount]);

  const onClaim = () => {
    try {
      const response = dispatch(claimAuction({tokenId:Number(tokenId),seller}));
      console.log(response);
      
    } catch (error) {
      console.log(error);
      
    }
  };

  // ========== Effects ==========
  useEffect(() => {
    if (!tokenId || !seller) return;
    dispatch(getBidHistory({ tokenId, seller }));
  }, [dispatch, tokenId, seller]);

  // ========== Computed Auction States ==========
  const auctionEnded = Date.now() > nft.auctionEndTime * 1000;
  const canClaim = auctionEnded && !nft.claimed;

  const isSeller = useMemo(() => {
    const canBid = nft.seller == address?.toLowerCase();
    console.log(canBid);

    return canBid;
  }, [nft.seller, address]);

  const displayBid = useMemo(() => {
    const ethValue =
      nft.highestBid === "0" ? nft.price : formatEther(nft.highestBid);
    return ShortenPrecisionPrice(ethValue);
  }, [nft]);
  // ========== Render ==========
  return (
    <>
      {/* Auction Info */}
      <div className="bg-[#151c36] p-6 rounded-xl border border-purple-800/50 mb-8 shadow-xl">
        <p className="text-sm text-gray-400 uppercase font-medium mb-2">
          AUCTION {auctionEnded ? "ENDED" : "ENDS IN"}:
        </p>

        {!auctionEnded && (
          <TimerDisplay
            startTime={nft.auctionStartTime * 1000}
            endTime={nft.auctionEndTime * 1000}
          />
        )}

        {/* Highest Bid Info */}
        <div className="text-white mb-4">
          <p>
            <span className="text-gray-400">
              {nft.highestBid == "0" ? "Min Bid" : "Highest Bid"}{" "}
            </span>
            {" : "}
            <span className="text-glow-purple font-bold">{displayBid} ETH</span>
          </p>
          <p>
            <span className="text-gray-400">Highest Bidder:</span>{" "}
            <span className="text-purple-400 break-words">
              {nft.highestBidder}
            </span>
          </p>
        </div>

        {/* Bid Input */}
        {!isSeller && (
          <>
            <FormInput
              label={myBid ? "Increase Your Bid" : "place a bid :"}
              placeholder="Enter price"
              type="text"
              value={bidAmount}
              inputClass="my-3"
              icon="ETH"
              onChange={(e) => {
                let value = e.target.value.replace(/[^0-9.]/g, "");
                if ((value.match(/\./g) || []).length > 1) return;

                const parts = value.split(".");
                if (parts[1]?.length > 5) parts[1] = parts[1].slice(0, 5);
                value = parts.join(".");

                setBidAmount(value);
              }}
            />
            {Number(bidAmount) != 0 && (
              <p className="text-white font-bold text-lg">
                Total:{" "}
                <span className="text-glow-purple">{totalBidEth} ETH</span>
              </p>
            )}
          </>
        )}
        {/* Action Button */}
        <Button
          title={
            auctionEnded
              ? canClaim
                ? "CLAIM NFT"
                : "AUCTION ENDED"
              : "PLACE BID"
          }
          loading={(auctionEnded && !canClaim) || (isSeller && !canClaim)}
          handleClick={auctionEnded ? onClaim : onPlaceBid}
          othercss={cn(
            "font-bold py-3 px-6 rounded-xl text-lg shadow-lg transition-all",
            auctionEnded
              ? canClaim
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          )}
        />
      </div>

      {/* Bid History */}
      <div className="mt-6 bg-[#10172b] p-4 rounded-lg border border-purple-700/40 max-h-56 overflow-y-auto">
        <h3 className="text-lg font-semibold text-purple-400 mb-3">
          Bid History
        </h3>

        {loading && <p className="text-gray-400">Loading bids...</p>}
        {!loading && bids.length === 0 && (
          <p className="text-gray-500 text-sm">No bids yet.</p>
        )}

        {bids.map((b, i) => (
          <div
            key={i}
            className={cn(
              "flex justify-between text-sm py-1 border-b border-gray-700/30 last:border-none",
              b.bidder == myBid?.bidder && "bg-green-300/30  px-2"
            )}
          >
            <span className="text-purple-300 break-words">
              {b?.bidder?.slice(0, 6)}...{b?.bidder?.slice(-4)}
            </span>
            <span className="text-gray-300">{b.bid} ETH</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default React.memo(AuctionCollection);
