import React, { useState } from 'react';
import Image from 'next/image';
import { useMediaQuery } from 'usehooks-ts';
import { useRouter } from 'next/router';
import { NFT } from '@/types';
import { ShortenPrecisionPrice } from '@/utils/ShortenPrecisionPrice';
import Button from '@/components/ui/Button';

type UserNftsProps = {
  item: NFT;
  loading?: boolean;
};

const UserNft = ({ item }: UserNftsProps) => {
  const isDesktop = useMediaQuery('(min-width:768px)');
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const handleMintClick = () => {
    router.push(`/nft/${item.username}/${item.tokenId}`)
  };

  return (
    <div
      className="relative group rounded-2xl overflow-hidden border border-white/10 
      bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl 
      transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_-5px_#6366f1]/40"
    >
      {/* Image Section */}
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          fill
          src={item.image || '/eth.svg'}
          alt={item.name || 'NFT'}
          className={`object-cover transition-all duration-500 ${
            isLoading ? 'scale-105 blur-md' : 'scale-100 blur-0'
          }`}
          onLoadingComplete={() => setIsLoading(false)}
        />

        {/* Overlay with Mint Button */}
        <div
          className="absolute inset-0 flex items-center justify-center 
          bg-gradient-to-t from-black/60 via-black/40 to-transparent 
          opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <Button
            title={'Show Details'}
            handleClick={handleMintClick}
            othercss="px-5 py-2.5 rounded-xl bg-indigo-500 text-white font-semibold 
            shadow-lg hover:bg-indigo-400 transition-all duration-300 
            translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <h3 className="text-lg md:text-xl text-white font-semibold truncate mt-1">{item.name}</h3>

        {/* Status + Price */}
        <div
          className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2 mt-3
          border border-white/10"
        >
          <div className="flex items-center gap-1">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                item.isListed ? 'bg-green-400' : 'bg-red-400'
              }`}
            ></span>
            <p
              className={`text-sm font-medium ${item.isListed ? 'text-green-300' : 'text-red-300'}`}
            >
              {item.isListed ? 'Available' : 'Sold Out'}
            </p>
          </div>
          <div className="text-right font-Cascadia font-semibold">
            <p className="text-xs text-gray-400">Price</p>
            <p className="text-base font-bold text-indigo-400">
              {ShortenPrecisionPrice(item.price)} ETH
            </p>
          </div>
        </div>
      </div>

      {/* Subtle Glow on Hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 pointer-events-none" />
    </div>
  );
};

export default React.memo(UserNft);
