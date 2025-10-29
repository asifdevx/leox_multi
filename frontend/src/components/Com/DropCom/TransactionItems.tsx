
import { AppDispatch, RootState } from "@/components/store/store";
import { fetchNFT } from "@/reducer/nftSlice";
import { NftState } from "@/types";
import { useEffect,useCallback,useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "usehooks-ts";
import Button from "../../ui/Button";
import { TransactionSkeleton } from "../../ui/skeleton";
import TransactionsItem from "./TransactionsItem";

export default function LatestTransaction() {
  
  console.count("LatestTransaction");

  const dispatch = useDispatch<AppDispatch>();
  const isDesktop = useMediaQuery("(min-width: 450px)");

  const { listings, loading, error, hasMore, offset, limit, sortBy } =
    useSelector((state: RootState) => state.nft as NftState);
  useEffect(() => {

    console.log(listings);
    
   
  }, [])
  
  useEffect(() => {
    if (listings.length === 0) {
      dispatch(fetchNFT({ start: 0, limit, sortBy: "recent" }));
    }
  }, [dispatch, listings.length, limit, sortBy]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchNFT({ start: offset, limit, sortBy: "recent" }));
    }
  }, [loading, hasMore, dispatch, offset, limit, sortBy]);
  
  const skeletons = useMemo(() => Array.from({ length: limit }), [limit]);

  return (
    <div className="mx-auto px-4 py-8 bg-nft-dark-gradient text-white min-h-screen">
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* 🧱 Case 1: Initial load */}
        {loading &&
          listings.length === 0 &&
          skeletons.map((_, idx) => (
            <TransactionSkeleton key={`initial-skeleton-${idx}`} />
          ))}

        {/* 🧱 Case 2: Loaded items */}
        {listings.filter((e)=>e.isListed===true).map((item, index) => (
          <div
            key={`${item.tokenId}-${item.seller}-${index}`}
            className="transition-all duration-300 cursor-pointer"
          >
            <TransactionsItem item={item} isDesktop={isDesktop} />
          </div>
        ))}

        {/* 🧱 Case 3: Loading more (append skeletons at end) */}
        {loading &&
          listings.length > 0 &&
          skeletons.map((_, idx) => (
            <TransactionSkeleton key={`loadmore-skeleton-${idx}`} />
          ))}
      </div>

      <div className="w-full flex justify-center items-center mt-8">
        {error && <p className="text-red-600">{error}</p>}
        {!loading && hasMore && (
          <Button
            title="Load More"
            handleClick={loadMore}
            othercss="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          />
        )}
      </div>
    </div>
  );
}
