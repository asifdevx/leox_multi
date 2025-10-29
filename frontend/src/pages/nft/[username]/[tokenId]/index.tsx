// pages/[username]/[tokenId].tsx
import ProfileIcon from '@/components/Com/HelperCom/ProfileIcon';
import ProfileStatusWrapper from '@/components/Com/HelperCom/ProfileStatusWrapper';
import useUserProfile from '@/hooks/useUserProfile';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import * as t from '@/types';
import { shortenAddress } from '@/utils/ShortenAddress';
import { MdVerified } from 'react-icons/md';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import Button from '@/components/ui/Button';
import { FaHeart } from 'react-icons/fa6';
import { IoShare } from 'react-icons/io5';
import { FiRefreshCcw } from 'react-icons/fi';
import { cn } from '@/utils/cn';
import SingleLine from '@/components/Com/HelperCom/SingleLine';
import DescriptionPanel from '@/components/Com/nftCom/DescriptionPanel';
import { useAccount } from 'wagmi';
import HandleNftButton from '@/components/Com/nftCom/HandleNftButton';
import ExpandableText from '@/components/Com/HelperCom/ExpandableText';

const IndexPage: React.FC = () => {
  console.count('nft[username]');

  const router = useRouter();
 
  const { username, tokenId } = router.query;

  const { profile, loading, error, retry } = useUserProfile(username as string);
  const specificNft = profile?.nfts?.owned?.find((e) => e.tokenId === tokenId);





  const { user, nfts } = profile || {};
  return (
    <ProfileStatusWrapper loading={loading} error={error} profile={profile} onRetry={retry}>
      {profile && (
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-14 mt-10 text-white">
          {/* Top Row */}
          {specificNft ? (
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left: Image + Tabs */}
              <div className="w-full md:w-1/2 flex flex-col items-center gap-6">
                {/* Gradient Border wrapper */}
                <GradientBorder className="w-full xl:w-4/5">
                  <div className="relative aspect-square rounded-xl overflow-hidden">
                    {/* neon glow behind image */}
                    <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
                      <div
                        className="absolute -inset-6 blur-3xl opacity-60"
                        style={{
                          background:
                            'radial-gradient(closest-side, rgba(0,255,215,0.14), rgba(0,255,215,0.03) 40%, transparent 60%)',
                        }}
                      />
                    </div>

                    <Image
                      src={specificNft.image}
                      alt={specificNft.name}
                      fill
                      sizes="(max-width:768px) 100vw, 60vw"
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                </GradientBorder>

                {/* Description panel (condensed) */}
                <DescriptionPanel specificNft={specificNft} />
              </div>

              {/* Right: Sticky Info Panel */}
              <aside className="w-full md:w-1/2 flex justify-center xl:justify-end">
                <div className="w-full max-w-[360px] sticky top-24 self-start space-y-6">
                  {/* Title + small icon */}
                  <div className="flex items-center gap-3">
                    <Image src="/nft_1.png" alt="icon" width={36} height={36} />
                    <ExpandableText className="text-md font-extrabold break-words" text={specificNft.name as string} expandLabel="..." collapseLabel=''/>
                    <span className="ml-auto text-sm text-white/60">{/* optional */}</span>
                  </div>

                  {/* Royalties */}
                  <div className="inline-flex items-center gap-2">
                    <p className="text-white/80">Royalties</p>
                    <span className="bg-yellow/60 text-black rounded-3xl px-2 py-1 text-sm font-medium">
                      0%
                    </span>
                  </div>

                  {/* Owner / Creator */}
                  <ShowOwner
                    seller={specificNft.seller}
                    creator={specificNft.owner}
                    sellerName={specificNft.username}
                  />

                  {/* thin divider */}
                  <SingleLine />

                  {/* Actions row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-white/80">
                        <FaHeart className="text-red-600" />
                        <span>{user?.follower}</span>
                      </button>
                      <button className="flex items-center gap-2 text-white/80">
                        <IoShare />
                        <span>Share</span>
                      </button>
                      <button className="flex items-center gap-2 text-white/80">
                        <FiRefreshCcw />
                        <span>Refresh</span>
                      </button>
                    </div>

                    <HiOutlineDotsHorizontal className="text-white/60" />
                  </div>

                  {/* Price card with gradient border */}
                  <GradientBorder className="w-full">
                    <div className="bg-[#0b0f12] p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/70 text-sm">Price</p>
                          <p className="text-lg font-bold">
                            {Number(specificNft.price) === 0 ? 'Not for sale' : specificNft.price}
                          </p>
                        </div>

                        <div>
                          <p className="text-white/70 text-sm">Highest bid</p>
                          <p className="text-lg font-semibold">{specificNft.highestBid || '—'}</p>
                        </div>
                      </div>

                     <HandleNftButton specificNft={specificNft}/>
                    </div>
                  </GradientBorder>
                </div>
              </aside>
            </div>
          ) : (
            <p>NFT not found for this token ID.</p>
          )}

          {/* More from this collection */}
        </div>
      )}
    </ProfileStatusWrapper>
  );
};

export default IndexPage;

/* ---------- Helpers ---------- */

const GradientBorder: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  // wrapper that renders a 2px gradient border using Tailwind arbitrary gradients
  return (
    <div
      className={`rounded-xl p-[2px] ${className}`}
      // using an arbitrary background gradient so no external CSS required
      style={{
        background:
          'linear-gradient(135deg, rgba(11,26,42,1) 0%, rgba(16,43,68,1) 50%, rgba(21,64,92,1) 100%)',
      }}
    >
      <div className="bg-[#071018] rounded-lg">{children}</div>
    </div>
  );
};

const ShowOwner = React.memo(
  ({ seller, creator, sellerName }: { seller: string; creator?: string; sellerName: string }) => {
    return (
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <MdVerified size={28} className="absolute -bottom-2 -right-3 text-yellow-400 z-20" />
            <ProfileIcon address={seller} width={64} height={64} border={false} />
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-white/70 line-clamp-1 min-w-24">Current owner</p>
            <p className="text-lg font-extrabold">{sellerName}</p>
          </div>
        </div>

        {creator && creator !== seller && (
          <div className="flex items-center gap-4">
            <div className="relative">
              <MdVerified size={28} className="absolute -bottom-2 -right-3 text-yellow-400 z-20" />
              <ProfileIcon address={creator} width={64} height={64} border={false} />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-white/70">Creator</p>
              <p className="text-lg font-extrabold">{shortenAddress(creator)}</p>
            </div>
          </div>
        )}
      </div>
    );
  },
);

const CollectionCard: React.FC<{ nft: t.NFT }> = ({ nft }) => {
  return <div></div>;
};
