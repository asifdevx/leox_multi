import { AppDispatch, RootState } from "@/components/store/store";
import { fetchNFT } from "@/reducer/nftSlice";
import { NftState } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../ui/Button";
import { RecentTransaction } from "../../ui/skeleton";
import TransactionItems from "./TransactionsItem";


export default function LatestTransaction() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { listings, loading, error, hasMore, offset, limit ,sortBy} = useSelector(
    (state: RootState) => state.nft as NftState
  );

  useEffect(() => {
    
    if (listings.length === 0) {
      dispatch(fetchNFT({ start: 0, limit ,sortBy:"recent"}));
    }
  }, [dispatch, listings.length, limit,sortBy]);

  const loadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchNFT({ start: offset, limit ,sortBy:"recent"}));
    }
  };

  return (
    <div className="mx-auto px-4 py-8 bg-nft-dark-gradient text-white min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading && listings.length === 0
          ? Array.from({ length: limit }).map((_, idx) => (
              <RecentTransaction key={idx} />
            ))
          : listings.map((item, index) => (
              <div
                key={`${item.tokenId}-${item.seller}-${index}`}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
               <TransactionItems item={item}/>
              </div>
            ))}
      </div>

      <div className="w-full flex justify-center items-center mt-8">
        {loading && listings.length > 0 && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && hasMore  &&(
        
          <Button title="Load More" handleClick={loadMore} othercss="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"/>
        )}
        
      </div>
    </div>
  );
}
