import { cn } from "@/utils/cn";
import React from "react";
interface BidItemProps {
    bidder: string;
    bid: string;
    isWinner?: boolean;
  }
  
  const BidItem =({ bidder, bid, isWinner }: BidItemProps) => (
    <div
      className={cn(
        'flex justify-between text-sm py-1 border-b border-gray-700/30 last:border-none px-2',
        isWinner && 'bg-green-300/30 font-bold'
      )}
    >
      <span className="text-purple-300 break-words">
        {bidder.slice(0, 6)}...{bidder.slice(-4)}
      </span>
      <span className="text-gray-300">{bid} ETH</span>
    </div>
  );
  
  export default React.memo(BidItem);
 