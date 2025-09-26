import { AppDispatch, RootState } from "@/components/store/store";
import { fetchNFT } from "@/reducer/nftSlice";
import { NftState } from "@/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function LatestTransaction() {
  const dispatch = useDispatch<AppDispatch>();
  const { listings, loading, error, hasMore, offset, limit } = useSelector(
    (state: RootState) => state.nft as NftState
  );

  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
    
    if (listings.length === 0) {
      dispatch(fetchNFT({ start: 0, limit }));
    }
  }, [dispatch, listings.length, limit]);


  const loadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchNFT({ start: offset, limit }));
    }
  };

  return (
    <div className="mx-auto px-4 py-8 bg-white min-h-screen">
    {loading && listings.length === 0 ? (
      <div className="text-center text-xl font-semibold text-gray-600">
        Loading NFTs...
      </div>
    ) : (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {listings.map((item, index) => (
            <div
              key={`${item.tokenId}-${item.seller}-${index}`}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg">
                <img
                  src={item.image || "/eth.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover aspect-square bg-gray-300"
                />
              </div>
              <div className="flex flex-col gap-2 p-3">
                <p className="text-xs text-gray-500">User Name</p>
                <h5 className="font-semibold text-lg text-gray-800 truncate">
                  {item.name}
                </h5>
                <div className="flex bg-gray-100 w-full items-center justify-between px-3 py-2 rounded-lg mt-2">
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500">Status</p>
                    {item.isListed === false ? (
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
                      {item.price} ETH
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more section */}
        <div className="w-full flex justify-center items-center mt-8">
          {loading && listings.length > 0 && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && hasMore && (
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Load More
            </button>
          )}
        </div>
      </>
    )}
  </div>
  );
}
