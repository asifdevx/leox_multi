import { NFT } from "@/types";
import Image from "next/image";
import React from "react";

const SliderItems = ({ item, isDesktop }: { item: NFT; isDesktop?: boolean }) => {
  return (
    <div className="relative group p-2 border border-white/40 rounded-lg overflow-hidden">
      {/* Image */}
      <div className="relative w-full aspect-square">
        <Image
          fill
          loading="lazy"
          src={item.image || "/eth.svg"}
          alt={item.name || "NFT image"}
          className="object-cover rounded-lg"
        />

        {/* Overlay with slide-up Mint button */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-end justify-center">
          <button
            className="mb-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 
            bg-white text-black px-4 py-2 rounded-lg font-semibold transition-all duration-300"
          >
            Mint
          </button>
        </div>
      </div>

      {/* Name */}
      <p className="mt-2 text-lg text-white w-full truncate">{item.name}</p>

      {/* Info Row */}
      <div className="w-full flex items-center justify-between mt-1 gap-1">
        <p className="flex items-center text-sm">
          {item.isListed ? (
            <span className="text-green-300 font-semibold">Now</span>
          ) : (
            <span className="text-gray-400">Not listed</span>
          )}
        </p>
        <p className="font-semibold text-[11px]/[15px] text-gray-500">
          {item.price} ETH
        </p>
      </div>
    </div>
  );
};

export default SliderItems;
