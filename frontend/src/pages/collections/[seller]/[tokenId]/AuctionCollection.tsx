import FormInput from "@/components/HelperCom/FormInput";
import { AppDispatch, RootState } from "@/components/store/store";
import Button from "@/components/ui/Button";
import { bidToken } from "@/reducer/BuySlice";
import { NFT } from "@/types";
import { cn } from "@/utils/cn";
import { ShortenPrecisionPrice } from "@/utils/ShortenPrecisionPrice";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";

const AuctionCollection = ({ nft }: { nft: NFT }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { address } = useAccount();
  const { bidHistory, error, loading } = useSelector(
    (state: RootState) => state.buyOrBid
  );
  if (!nft) notFound();
  const { tokenId, seller } = nft;
const bids = bidHistory?.[tokenId]?.[seller]||[];

  const isAuction = nft.saleType === 1;
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    progress: 0,
  });

  const onPlaceBid = () => {
    dispatch(
      bidToken({
        tokenId: Number(tokenId),
        seller,
        bidder: address!,
        bidAmount: Number(bidAmount),
      })
    );
  };
  const onClaim = () => {};

  useEffect(() => {
    if (!isAuction) return;
    const endTime = nft.auctionEndTime * 1000;
    const startTime = nft.auctionStartTime * 1000;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;

      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, progress: 100 });
        return;
      }

      const hours = Math.floor(remaining / 1000 / 60 / 60);
      const minutes = Math.floor((remaining / 1000 / 60) % 60);
      const seconds = Math.floor((remaining / 1000) % 60);

      const progress = Math.min(
        100,
        Math.max(0, ((now - startTime) / (endTime - startTime)) * 100)
      );

      setTimeLeft({ hours, minutes, seconds, progress });
    }, 1000);

    return () => clearInterval(timer);
  }, [nft.auctionEndTime, nft.auctionStartTime, isAuction]);

  const auctionEnded = Date.now() > nft.auctionEndTime * 1000;
  const canClaim = auctionEnded && !nft.claimed;

  return (
    <>
      <div className="bg-[#151c36] p-6 rounded-xl border border-purple-800/50 mb-8 shadow-xl">
        <p className="text-sm text-gray-400 uppercase font-medium mb-2">
          AUCTION {auctionEnded ? "ENDED" : "ENDS IN"}:
        </p>
        {!auctionEnded && (
          <h2 className="text-3xl font-bold text-glow-purple mb-4">
            {timeLeft.hours.toString().padStart(2, "0")}:
            {timeLeft.minutes.toString().padStart(2, "0")}:
            {timeLeft.seconds.toString().padStart(2, "0")}
          </h2>
        )}
        {/* Progress Bar */}
        <div className="h-2 w-full bg-[#1f2847] rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${timeLeft.progress}%` }}
          />
        </div>

        <p className="text-xs text-gray-400 text-right">
          {Math.floor(timeLeft.progress)}% completed
        </p>
        {/* Highest Bid Info */}
        <div className="text-white mb-4">
          <p>
            <span className="text-gray-400">
              {nft.highestBid == "0" ? "Min Bid" : "Highest Bid"}{" "}
            </span>
            {" : "}
            <span className="text-glow-purple font-bold">
              {ShortenPrecisionPrice(
                nft.highestBid == "0" ? nft.price : nft.highestBid
              )}{" "}
              ETH
            </span>
          </p>
          <p>
            <span className="text-gray-400">Highest Bidder:</span>{" "}
            <span className="text-purple-400 break-words">{}</span>
          </p>
        </div>
        <FormInput
          label="Add Bid :"
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
        <Button
          title={
            auctionEnded
              ? canClaim
                ? "CLAIM NFT"
                : "AUCTION ENDED"
              : "PLACE BID"
          }
          loading={auctionEnded && !canClaim}
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
            className="flex justify-between text-sm py-1 border-b border-gray-700/30 last:border-none"
          >
            <span className="text-purple-300 break-words">
              {b.bidder.slice(0, 6)}...{b.bidder.slice(-4)}
            </span>
            <span className="text-gray-300">{b.bid} ETH</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default AuctionCollection;
