import { NFTimage } from '@/components/ui/skeleton';
import { NFT } from '@/types';
import { ShortenPrecisionPrice } from '@/utils/ShortenPrecisionPrice';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const TransactionsItem = ({ item, isDesktop }: { item: NFT; isDesktop?: boolean }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const handleMintClick = () => {
    router.push(`/collections/${item.seller}/${item.tokenId}`);
  };


  return (
    <div
      className="relative group rounded-sm md:rounded-2xl overflow-hidden border border-white/10 
      bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl 
      transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_-5px_#22d3ee]/40"
    >
      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden">
      {item.saleType === 0 && item.remainingSupply > 0 && (
    <div className="absolute z-30 bg-white/70 text-black bottom-2 left-2 px-2 py-1 rounded text-xs font-semibold ">
       {item.remainingSupply}
    </div>
  )}
        {isLoading && <NFTimage />}

        <Image
          fill
          loading="lazy"
          src={item.image || '/eth.svg'}
          alt={item.name || 'NFT image'}
          className={`object-cover transition-all duration-500 ${
            isLoading ? 'scale-105 blur-md' : 'scale-100 blur-0'
          }`}
          onLoadingComplete={() => setIsLoading(false)}
        />

        {/* Hover Overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center 
          bg-gradient-to-t from-black/70 via-black/40 to-transparent 
          opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <button
            onClick={handleMintClick}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-white font-semibold 
            shadow-lg hover:bg-cyan-400 transition-all duration-300 
            translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          >
            Mint
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3 md:p-1">
        {/* Seller (Desktop only) */}
        {isDesktop && (
          <p
            className="text-sm text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors"
            onClick={() => router.push(`${item.username}/owned`)}
          >
            {item.username || 'Unknown Seller'}
          </p>
        )}

        {/* NFT Name */}
        <h3
          className={`font-semibold truncate ${
            isDesktop ? 'text-lg text-white mt-1' : 'text-base text-white/90 mt-1'
          }`}
        >
          {item.name || 'Unnamed NFT'}
        </h3>

        {/* Info (Desktop) */}
        {isDesktop ? (
          <div
            className="flex items-center justify-between bg-white/5 rounded-xl px-1 py-2 mt-3
            border border-white/10"
          >
            <div className="flex items-center gap-2 text-left text-xs sm:text-xs">
              {/* Status Dot */}
              <span
                className={`w-2.5 h-2.5 rounded-full
                  bg-green-400
                `}
              />

              {/* Status Text */}
              <p className={`font-medium text-green-300`}>
                Available
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-400">Price</p>
              <p className="text-sm md:text-base font-bold text-cyan-400">
                {ShortenPrecisionPrice(item.price)} ETH
              </p>
            </div>
          </div>
        ) : (
          // Mobile layout
          <div className="flex items-center justify-between mt-2 px-1">
            <p className="flex items-center gap-1 text-xs">
             
                <span className="text-green-300 font-semibold">Now</span>
           
            </p>
            <p className="font-semibold text-[12px] text-cyan-400">
              {ShortenPrecisionPrice(item.price)} ETH
            </p>
          </div>
        )}
      </div>

      {/* Glow Layer */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 pointer-events-none" />
    </div>
  );
};

export default React.memo(TransactionsItem);
