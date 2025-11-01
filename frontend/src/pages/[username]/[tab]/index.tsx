import ProfileStatusWrapper from '@/components/Com/HelperCom/ProfileStatusWrapper';
import UserNft from '@/components/Com/profileCom/UserNft';
import { TransactionSkeleton } from '@/components/ui/skeleton';
import useUserProfile from '@/hooks/useUserProfile';
import { NFT } from '@/types';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useCallback, useMemo } from 'react';

type Tab = 'owned' | 'sold' | 'created' | 'sale';
const BATCH_SIZE = 20;

const IndexPage = () => {
  console.count('render -> nfts');
  const router = useRouter();
  const { username, tab } = router.query;

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready && router.isReady && username && tab) {
      setReady(true);
    }
  }, [ready, router.isReady, username, tab]);

  if (!router.isReady || !username || !tab) {
    return null;
  }

  const { profile, loading, error, retry } = useUserProfile(username as string);

  const nfts: NFT[] = useMemo(() => {
    return profile?.nfts?.[tab as Tab] ?? [];
  }, [profile, tab]);
  console.log('ndt', nfts);

  const skeletons = useMemo(() => Array.from({ length: 10 }), []);

  // ✅ Infinite scroll
  const [displayedNfts, setDisplayedNfts] = useState<NFT[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    console.log('🟣 Tab changed → resetting displayed NFTs:', tab, nfts.length);
    setDisplayedNfts(nfts.slice(0, BATCH_SIZE));
    setHasMore(nfts.length > BATCH_SIZE);
  }, [tab, nfts]);

  useEffect(() => {
    if (nfts.length > 0 && displayedNfts.length === 0) {
      console.log('Initializing displayed NFTs...');
      setDisplayedNfts(nfts.slice(0, BATCH_SIZE));
      setHasMore(nfts.length > BATCH_SIZE);
    } else if (nfts.length === 0 && displayedNfts.length > 0) {
      console.log('Clearing displayed NFTs...');
      setDisplayedNfts([]);
      setHasMore(false);
    }
  }, [nfts, displayedNfts.length]);

  const handleScroll = useCallback(() => {
    if (!hasMore) return;

    const { scrollY } = window;
    const { scrollHeight } = document.documentElement;
    const { innerHeight: clientHeight } = window;

    if (scrollY + clientHeight >= scrollHeight - 250) {
      setDisplayedNfts((prev) => {
        const nextBatch = nfts.slice(prev.length, prev.length + BATCH_SIZE);
        const newList = [...prev, ...nextBatch];
        if (newList.length >= nfts.length) setHasMore(false);
        return newList;
      });
    }
  }, [hasMore, nfts]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  return (
    <ProfileStatusWrapper loading={loading} error={error} profile={profile} onRetry={retry}>
      <div className="section_padding w-full min-h-screen">
        {displayedNfts.length > 0 ? (
          <div className="grid-layout">
            {displayedNfts.map((e: NFT, idx) => (
              <UserNft item={e} key={`${e.tokenId}-${e.seller}-${idx}`} />
            ))}
          </div>
        ) : (
          <div className="relative w-full">
            {/* Skeletons in the background */}
            <div className="grid-layout">
              {skeletons.map((_, idx) => (
                <TransactionSkeleton key={idx} />
              ))}
            </div>

            {/* Centered overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
              <div className="text-white text-lg font-semibold p-4 bg-black/80 rounded-lg shadow-lg">
                No NFT Found
              </div>
            </div>
          </div>
        )}

        {hasMore && <p className="text-center text-gray-400 mt-4">Loading more NFTs...</p>}
      </div>
    </ProfileStatusWrapper>
  );
};

export default React.memo(IndexPage);
