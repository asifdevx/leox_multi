import { AiOutlineLoading3Quarters } from "react-icons/ai";
import BidItem from "../HelperCom/BidItem";
import React from 'react'

const BidHistory = ({ bids, loading, highestBidder }: { bids: any[]; loading: boolean; highestBidder?: string }) => (
    <div className="flex flex-col gap-2">
      {loading && <p className="text-gray-400 flex items-center gap-2"><AiOutlineLoading3Quarters className="animate-spin" /> Loading bids...</p>}
      {!loading && bids.length === 0 && <p className="text-gray-500 text-sm">No bids yet.</p>}
      {!loading && bids.length > 0 && bids.map((b, i) => (
        <BidItem key={i} bidder={b.bidder} bid={b.bid} isWinner={b.bidder.toLowerCase() === highestBidder?.toLowerCase()} />
      ))}
    </div>
  );
  

export default React.memo(BidHistory)