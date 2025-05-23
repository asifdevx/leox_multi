import { AppDispatch, RootState } from "@/components/store/store";
import { fetchNFT } from "@/reducer/nftSlice";
import { NFTState } from "@/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function LatestTransaction() {
  const dispatch = useDispatch<AppDispatch>();
  const { nfts, loading } = useSelector(
    (state: RootState) => state.nft as NFTState
  );

  useEffect(() => {
    dispatch(fetchNFT());
  }, [dispatch]);
  console.log("fatchNFT",nfts);
  

  return (
    <div className=" mx-auto px-4 py-8 bg-white">
      {loading ? (
        <div className="text-center text-xl font-semibold text-gray">
          Loading NFTs...
        </div>
      ) : (
        <div className="grid grid-cols-1 small:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {nfts.map((items, index) => (
            <div
              key={index}
              className="border border-[black]/20 rounded-lg  overflow-hidden hover:shadow-xl transition-all duration-300 p-3"
            >
              <div className="w-full bg-gray-200 flex items-center justify-center overflow-hidden rounded-lg">
                <img
                  src={items.image}
                  alt={items.name}
                  className="w-full h-full object-cover aspect-square bg-gray-300"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs text-gray-600">User Name</p>
                <h5 className="font-semibold text-lg capitalize text-gray-800">
                  {items.name}
                </h5>
                <div className="flex bg-gray-200 w-full items-center justify-between px-3 py-2 rounded-lg">
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500">Status</p>
                    {items.isSold === false ? (
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <p className="text-sm font-medium text-green-600">
                          Available
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-red-600">
                        Sold Out
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-lg font-bold text-indigo-600">
                      {items.price} ETH
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

