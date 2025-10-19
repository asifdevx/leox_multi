import React from "react";
import { PreviewNFTProps } from "@/types";
import { ShortenPrecisionPrice } from "@/utils/ShortenPrecisionPrice";


const PreviewNFT = ({ preview, name, price, activeTab,supply }: PreviewNFTProps) => {
  function shortName(name: string) {
    return name.length > 15 ? `${name.slice(0, 15)}...` : name;
  }
  const isAuction = activeTab === "Auction";

  return (
    <div className="sticky top-20 w-64">
      <h3 className="text-white font-semibold mb-4">Preview</h3>

      {preview ? (
        <div className="rounded-2xl bg-gradient-to-b from-[#112135] to-[#0b1a2a] shadow-lg shadow-black/30 overflow-hidden border border-[#1e3350]">
          {/* NFT Image */}
          <div className="relative w-full aspect-square flex items-center justify-center bg-[#132742]">
            <img
              src={preview}
              alt="NFT Preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* NFT Info */}
          <div className="p-5 flex flex-col gap-3">
            <p className="text-xs text-gray-400">Ethereum ERC-1155</p>

            <p className="font-semibold text-lg capitalize text-white">
              {name ? shortName(name) : "Untitled"}
            </p>

            <div className="flex bg-[#0f1f33]/60 border border-[#1e3350] w-full items-center justify-between px-4 py-3 rounded-xl">
              {/* Price */}
              <div className="flex flex-col">
                <p className="text-sm text-gray-400">
                  {isAuction ? "Min Price" : "price"}
                </p>
                <p className="text-base font-medium text-[#00d1ff]">
                  {price ? `${ShortenPrecisionPrice(price)} ETH` : "—"}
                </p>
              </div>

              {/* Bids */}
              <div className="text-right">
                {isAuction ? (
                  <>
                    <p className="text-sm text-gray-400">Highest bid</p>
                    <p className="text-base font-bold text-[#00ff95]">
                      No bids yet
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-400">Supply</p>
                    <p className="text-base font-bold text-[#00ff95]">
                      {supply}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Empty state
        <div className="rounded-2xl bg-gradient-to-b from-[#112135] to-[#0b1a2a] shadow-lg shadow-black/30 h-80 flex items-center justify-center text-gray-400 text-sm text-center px-5 border border-[#1e3350]">
          Upload a file and enter details to preview your brand-new NFT.
        </div>
      )}
    </div>
  );
};

export default PreviewNFT;
