import UserNfts from '@/components/Com/profileCom/UserNft';
import { RootState } from '@/components/store/store';
import { TransactionSkeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

type Tab = 'owned' | 'sale' | 'created' | 'sold';
const index = () => {
  const { tab } = useRouter().query;
  const { name } = useSelector((s: RootState) => s.userInfo);
  const profile = useSelector(
    (S: RootState) => S.userProfile.cache[(name as string)?.toLowerCase()],
  );
  if (!name || !tab || typeof name !== 'string' || typeof tab !== 'string') {
    return <p>Loading...</p>;
  }
  const nfts = profile.nfts[tab as Tab];
  const skeletons = useMemo(() => Array.from({ length: 15 }), []);

  return (
    <div className="section_padding w-full min-h-screen ">
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {nfts.length !== 0
          ? nfts.map((e, idx) => <UserNfts item={e} key={idx} />)
          : skeletons.map((_, idx) => <TransactionSkeleton key={idx} />)}
      </div>
    </div>
  );
};

export default index;
