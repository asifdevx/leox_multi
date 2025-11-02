import { AppDispatch, RootState } from '@/components/store/store';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { fetchNFT } from '@/reducer/nftSlice';
import { NftState } from '@/types';
import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';

import { TransactionSkeleton } from '../../ui/skeleton';
import TransactionsItem from './TransactionsItem';

export default function LatestTransaction() {
  console.count('Drops');

  const dispatch = useDispatch<AppDispatch>();
  const isDesktop = useMediaQuery('(min-width: 450px)');

  const { listings, loading, error, offset, limit, sortBy } = useSelector(
    (state: RootState) => state.nft as NftState,
  );
  
  const listedNFTs = useMemo(() => listings.filter((e) => e.isListed), [listings]);

  
  const skeletons = useMemo(() => Array.from({ length: limit }), [limit]);
// ===================hooks ==================
  const { displayedItems, hasMore } = useInfiniteScroll({
    items: listedNFTs,
    batchSize: limit,
  });

// ===================loadMore ==================
  const loadMore = useCallback(() => {
    if (!loading) {
      dispatch(fetchNFT({ start: offset, limit, sortBy }));
    }
  }, [loading, dispatch, offset, limit, sortBy]);

  
  useEffect(() => {
    dispatch(fetchNFT({ start: 0, limit, sortBy }));
  }, [dispatch, limit, sortBy]);

  useEffect(() => {
    if (hasMore && displayedItems.length === listings.length) {
      loadMore();
    }
  }, [displayedItems, hasMore, listings.length, loadMore]);


  return (
    <div className="mx-auto px-4 py-8 bg-nft-dark-gradient text-white min-h-screen">
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {/* Initial skeletons */}
      {loading && listings.length === 0 && skeletons.map((_, idx) => (
        <TransactionSkeleton key={`initial-skeleton-${idx}`} />
      ))}

      {/* Display NFTs */}
      {displayedItems.map((item, index) => (
        <div
          key={`${item.tokenId}-${item.seller}-${index}`}
          className="transition-all duration-300 cursor-pointer"
        >
          <TransactionsItem item={item} isDesktop={isDesktop} />
        </div>
      ))}

      {/* Loading more skeletons */}
      {loading && listings.length > 0 && skeletons.map((_, idx) => (
        <TransactionSkeleton key={`loadmore-skeleton-${idx}`} />
      ))}
    </div>
  </div>
  );
}
