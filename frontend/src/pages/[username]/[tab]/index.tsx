import ProfileStatusWrapper from '@/components/Com/HelperCom/ProfileStatusWrapper';
import UserNft from '@/components/Com/profileCom/UserNft';
import { RootState } from '@/components/store/store';
import { TransactionSkeleton } from '@/components/ui/skeleton';
import useUserProfile from '@/hooks/useUserProfile';
import { NFT } from '@/types';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';


type Tab = "owned" | "sold" | "created" |"sale";
const BATCH_SIZE = 20;



const IndexPage = () => {
  console.count("nfts")
  const router = useRouter();
  const { username, tab } = router.query;

  const { profile, loading, error, retry } = useUserProfile(username as string);
  
  const nfts: NFT[] = profile?.nfts?.[tab as Tab] ?? [];
  const skeletons = useMemo(() => Array.from({ length: 10 }), []);



  // Infinite Scroll State
  const [displayedNfts, setDisplayedNfts] = useState<NFT[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    if (nfts.length > 0) {
      setDisplayedNfts(nfts.slice(0, BATCH_SIZE));
      setHasMore(nfts.length > BATCH_SIZE);
    } else {
      setDisplayedNfts([]);
      setHasMore(false);
    }
  }, [nfts]);
  

  const handleScroll = useCallback(() => {
    if (!hasMore) return;

    const scrollY = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

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

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  return (
    <ProfileStatusWrapper loading={loading} error={error} profile={profile} onRetry={retry}>
     <div className="section_padding w-full min-h-screen">

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {displayedNfts.length > 0
          ? displayedNfts.map((e: NFT, idx) => (
              <UserNft item={e} key={e.tokenId || idx} />
            ))
          : skeletons.map((_, idx) => <TransactionSkeleton key={idx} />)}
      </div>

      {hasMore && (
        <p className="text-center text-gray-400 mt-4">Loading more NFTs...</p>
      )}
    </div>
    </ProfileStatusWrapper>
  );
};

export default React.memo(IndexPage);