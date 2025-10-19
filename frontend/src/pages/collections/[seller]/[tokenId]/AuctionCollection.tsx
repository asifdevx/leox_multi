import { NFT } from "@/types";
import { ShortenPrecisionPrice } from "@/utils/ShortenPrecisionPrice";
import React, { useEffect, useState } from "react";

const AuctionCollection = ({ nft }: { nft: NFT }) => {
  const isAuction = nft.saleType === 1;

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    progress: 0,
  });

  
  const onPlaceBid = () => {
    console.log("place BID");
  };
  const onClaim = () => {
    console.log("place BID");
  };
  
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
            <span className="text-gray-400">Highest Bid:</span>{" "}
            <span className="text-glow-purple font-bold">
              {ShortenPrecisionPrice(nft.highestBid)} ETH
            </span>
          </p>
          <p>
            <span className="text-gray-400">Highest Bidder:</span>{" "}
            <span className="text-purple-400 break-words">
              {nft.highestBidder || "—"}
            </span>
          </p>
        </div>

        {auctionEnded ? (
          canClaim ? (
            <button
              onClick={onClaim}
              className="neon-button bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-lg"
            >
              CLAIM NFT
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-700 text-gray-400 font-bold py-3 px-6 rounded-xl text-lg shadow-lg cursor-not-allowed"
            >
              AUCTION ENDED
            </button>
          )
        ) : (
          <button
            onClick={onPlaceBid}
            className="neon-button bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-lg"
          >
            PLACE BID
          </button>
        )}
      </div>
    </>
  );
};

export default AuctionCollection;
