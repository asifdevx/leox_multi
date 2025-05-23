import React from "react";
import { PreviewNFTProps } from "@/types";

const PreviewNFT = ({ preview, name, price }: PreviewNFTProps) => {
  function shortName(name: string) {
    return name.length > 15 ? `${name.slice(0, 15)}...` : name;
  }
  const min = 0.00001;
  const max = 100000;

  const formatPrice = (price: number) => {
    if (price === 0) return "0";
    if (price < min) return `<${min}`;
    if (price > max) return `>${max}`;
    return Number(price).toString();
  };
  return preview ? (
    <div className="border rounded-lg p-4 bg-grayborder w-64 shadow-lg">
      <p>Preview</p>

      <div className="w-full bg-gray-200 flex items-center justify-center overflow-hidden rounded-lg">
        <img
          src={preview}
          alt={preview}
          className="w-full h-full object-cover aspect-square bg-gray-300"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-600">Ethereum ERC-1155</p>
        <p className="font-semibold text-lg capitalize text-gray-800">
          {name ? shortName(name) : "untitled"}
        </p>
        <div className="flex bg-gray-200 w-full items-center justify-between px-3 py-2 rounded-lg">
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">Price</p>

            <p className="text-[13px] font-medium">
              {formatPrice(parseFloat(price))} ETH
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Highest bid</p>
            <p className="text-lg font-bold text-indigo-600">No bids yet</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      <p>Preview</p>
      <div className="border rounded-lg p-4 bg-white w-64 h-72 shadow-lg flex items-center justify-center text-gray-500 text-sm text-center">
        Upload a file and choose a collection to preview your brand-new NFT.
      </div>
    </div>
  );
};

export default PreviewNFT;
