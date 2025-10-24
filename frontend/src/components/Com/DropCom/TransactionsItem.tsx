import { NFTimage } from "@/components/ui/skeleton";
import { NFT } from "@/types";
import { ShortenPrecisionPrice } from "@/utils/ShortenPrecisionPrice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const TransactionsItem = ({
  item,
  isDesktop,
}: {
  item: NFT;
  isDesktop?: boolean;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const handleMintClick = () => {
    router.push(`/collections/${item.seller}/${item.tokenId}`);
  };

  return (
    <div className="relative group  bg-white/5 backdrop-blur-md border hover:-translate-y-2 transition-transform duration-300 border-white/10 rounded-xl shadow-lg p-2 overflow-hidden">
      {/* Image */}
      <div className="relative w-full aspect-square rounded-lg">
        {isLoading && <NFTimage />}

        <Image
          fill
          loading="lazy"
          src={item.image || "/eth.svg"}
          alt={item.name || "NFT image"}
          
          className={`object-cover rounded-lg w-full h-full ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoadingComplete={() => setIsLoading(false)}
        />

        {/* Overlay with slide-up Mint button */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-end justify-center rounded-lg">
          <button
            onClick={handleMintClick}
            className="mb-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 
            bg-white text-black px-4 py-2 rounded-lg font-semibold transition-all duration-300"
          >
            Mint
          </button>
        </div>
      </div>

      {/* Name */}
      {isDesktop && <p className="text-lg text-gray-600">{item.username || "anonyoumus"}</p>}
      <p className="mt-2 text-lg md:text-xl text-white w-full truncate">
        {item.name}
      </p>

      {/* Info Row */}
      {isDesktop ? (
        <div className="flex bg-gray-100 w-full items-center justify-between px-3 py-2 rounded-lg mt-2">
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">Status</p>
            {item.isListed ? (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <p className="text-sm font-medium text-green-600">Available</p>
              </div>
            ) : (
              <p className="text-sm font-medium text-red-600">Sold Out</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-lg font-bold text-indigo-600">
            {ShortenPrecisionPrice(item.price)}
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full flex items-center justify-between mt-1 gap-1">
          <p className="flex items-center text-sm">
            {item.isListed ? (
              <span className="text-green-300 font-semibold">Now</span>
            ) : (
              <span className="text-red-400">Sold</span>
            )}
          </p>
          <p className="font-semibold text-[11px]/[15px] text-indigo-600">
           {ShortenPrecisionPrice(item.price)}
            ETH
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(TransactionsItem);
