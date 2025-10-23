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
    <>
      {/* Fixed Price Section */}
      <div className="bg-[#151c36] p-6 rounded-xl border border-purple-800/50 mb-8 shadow-xl space-y-4">
        <p className="text-sm text-gray-400 uppercase font-medium">
          FIXED PRICE:
        </p>
        <h2 className="text-xl md:text-3xl font-bold mt-1 text-white">
          {nft.price} ETH
        </h2>
        <p className="text-gray-400 text-sm">
          ($
          <span className="text-green-400">{(Number(nft.price) * 3000).toFixed(4)}</span>)
        </p>

        {/* Quantity Selector */}
        <div className="flex items-center flex-col lg:flex-row gap-2">
          <p className="text-gray-400">Quantity:</p>
          <div className="flex items-center border border-purple rounded-lg overflow-hidden">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="px-3 py-1 bg-purple-700 hover:bg-purple-600 rounded-s-lg text-white font-bold"
            >
              -
            </button>
            <span className="px-4 py-1 bg-[#1f2847] text-white font-medium w-12 text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-e-lg"
            >
              +
            </button>
          </div>
          <span className="text-gray-400">
            / {nft.remainingSupply} available
          </span>
        </div>

        {/* Total Price */}
        <p className="text-white font-bold text-lg">
          Total:{" "}
          <span className="text-glow-purple">{ShortenPrecisionPrice(totalPrice.toString())} ETH</span>
        </p>

        {/* Buy Now Button */}
        <div className="flex flex-col space-y-4">
          <Button
            othercss="neon-button bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-lg"
            handleClick={buyNft}
            
            loading={loading || userAddress?.toLowerCase() === nft.seller.toLowerCase()} 
            title={
              loading
                ? (<>
                 <AiOutlineLoading3Quarters className="text-black animate-spin"/>
                  <span>Purchaseing</span>
                </>
                )
                : `BUY ${quantity} NFT${quantity > 1 ? "s" : ""}`
            }
          />
        </div>
      </div>
    </>
  );
};
export default React.memo(FixedCollection);


