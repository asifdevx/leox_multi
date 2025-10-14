import { NFT } from "@/types";
import React from "react";

const LatestDropTransactions = ({ item }: { item: NFT }) => {
  return (
    <>
      <div className="w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg">
        <img
          src={item.image || "/eth.svg"}
          alt={item.name}
          className="w-full h-full object-cover aspect-square bg-gray-300"
        />
      </div>
      <div className="flex flex-col gap-2 p-3">
        <p className="text-xs text-gray-500">User Name</p>
        <h5 className="font-semibold text-lg text-white truncate">
          {item.name}
        </h5>
        <div className="flex bg-gray-100 w-full items-center justify-between px-3 py-2 rounded-lg mt-2">
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">Status</p>
            {item.isListed === false ? (
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
              {item.price} ETH
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LatestDropTransactions;
