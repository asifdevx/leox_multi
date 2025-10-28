import { AppDispatch, RootState } from "@/components/store/store";
import Button from "@/components/ui/Button";
import { buyToken } from "@/reducer/BuySlice";
import { NFT } from "@/types";
import { ShortenPrecisionPrice } from "@/utils/ShortenPrecisionPrice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAccount } from "wagmi";

const FixedCollection = ({ nft }: { nft: NFT }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { error, loading } = useSelector((state: RootState) => state.buyOrBid);
  const [quantity, setQuantity] = useState(1);
  const { address: userAddress } = useAccount(); 
  const totalPrice = Number(nft.price) * quantity;

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= nft.remainingSupply) setQuantity(newQty);
  };
  const buyNft = () => {
    if(userAddress?.toLowerCase() == nft.seller.toLowerCase()){
      alert("cannot buy own token")
      return; 
    }
    dispatch(buyToken({tokenId:Number(nft.tokenId),seller:nft.seller,quantity,totalPrice}));
  };

  return (
    <div className="bg-gradient-to-br from-[#111933] to-[#181f3f] p-6 rounded-2xl border border-purple-700/40 shadow-lg space-y-4 hover:shadow-purple-600/40 transition-all duration-300">
    <p className="text-sm text-gray-400 uppercase tracking-wider">
      FIXED PRICE
    </p>
    <h2 className="text-3xl font-bold text-white">
      {nft.price} <span className="text-cyan-400">ETH</span>
    </h2>
    <p className="text-gray-400 text-sm">
      ($
      <span className="text-green-400">
        {(Number(nft.price) * 3000).toFixed(4)}
      </span>)
    </p>

    {/* Quantity Selector */}
    <div className="flex flex-wrap items-center gap-3 pt-2">
      <p className="text-gray-400">Quantity:</p>
      <div className="flex items-center border border-purple-700 rounded-lg overflow-hidden">
        <button
          onClick={() => handleQuantityChange(-1)}
          className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 font-bold"
        >
          -
        </button>
        <span className="px-4 py-1.5 bg-[#1b2242] text-white w-12 text-center">
          {quantity}
        </span>
        <button
          onClick={() => handleQuantityChange(1)}
          className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 font-bold"
        >
          +
        </button>
      </div>
      <span className="text-gray-500 text-sm">
        / {nft.remainingSupply} available
      </span>
    </div>

    {/* Total */}
    <p className="text-white font-semibold text-lg">
      Total:{' '}
      <span className="text-purple-400">
        {ShortenPrecisionPrice(totalPrice.toString())} ETH
      </span>
    </p>

    <Button
      othercss="w-full mt-3 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-md transition-all"
      handleClick={buyNft}
      loading={loading || userAddress?.toLowerCase() === nft.seller.toLowerCase()}
      title={
        loading ? (
          <>
            <AiOutlineLoading3Quarters className="text-white animate-spin inline-block mr-2" />
            Purchasing...
          </>
        ) : (
          `BUY ${quantity} NFT${quantity > 1 ? 's' : ''}`
        )
      }
    />
  </div>
  );
};
export default React.memo(FixedCollection);


