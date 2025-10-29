import { RootState } from '@/components/store/store';
import { NFT } from '@/types';
import React, { useCallback, useMemo, useState } from 'react';

import { useSelector } from 'react-redux';

import { TbWorldCode } from 'react-icons/tb';
import { FaEye } from 'react-icons/fa';
import SingleLine from '../HelperCom/SingleLine';
import { FiRefreshCcw } from 'react-icons/fi';
import BidHistory from './BidHistory';
import { Tabs } from './Tab';
import { Poperties } from '@/config/Nft';
import ExpandableText from '../HelperCom/ExpandableText';
const DescriptionPanel = ({ specificNft }: { specificNft: NFT }) => {
  const { bidHistory, loading } = useSelector((state: RootState) => state.buyOrBid);

  const [active, setActive] = useState<number>(0);
  const changeInfo = useCallback((idx: number) => {
    setActive(idx);
  }, []);
  const lowerSeller = specificNft.seller.toLowerCase();

  const bids = useMemo(() => {
    const list = bidHistory?.[specificNft.tokenId]?.[lowerSeller] || [];
    return list.slice().sort((a, b) => parseFloat(b.bid) - parseFloat(a.bid));
  }, [bidHistory, specificNft.tokenId, lowerSeller]);

  return (
    <>
      <div className="w-full xl:w-4/5 text-sm text-white">
        <Tabs
          tabs={['Overview', 'Properties', 'Bids', 'Activity']}
          active={active}
          onChange={changeInfo}
        />
        <SingleLine />
      </div>
      <div className="w-full xl:w-5/6 text-sm text-white">

        {/* Overview / Description */}
        {active === 0 && (
          <div className="flex flex-col gap-4  p-3 shadow-lg">
            <h3 className="text-xl font-bold text-white/90">Description</h3>
              <ExpandableText text={specificNft.description} maxChars={200} className="text-white/70 leading-relaxed break-words"/>
            <div className="bg-white/5 rounded-xl p-4 space-y-3">
              <h4 className="text-lg font-semibold text-purple-400">Bid History</h4>
              <BidHistory bids={bids} loading={loading} highestBidder={specificNft.highestBidder} />
            </div>

            <div className="bg-white/5 rounded-xl p-4 space-y-3">
              <h4 className="text-lg font-semibold text-white/80">Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <DetailItem icon={<TbWorldCode />} label="Base" value="ERC1155" />
                <DetailItem icon={<FaEye />} label="Open Original" value="View →" />
                <DetailItem icon={<FiRefreshCcw />} label="Refresh Metadata" value="" />
              </div>
            </div>
          </div>
        )}

        {/* Properties */}
        {active === 1 && (
          <div className="grid grid-cols-2 gap-3">
            {Poperties.map((attr, idx) => (
              <div key={idx} className="p-3 bg-white/5 rounded-lg flex flex-col">
                <span className="text-xs text-white/70">{attr.trait}</span>
                <span className="font-semibold text-white">{attr.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bids */}
        {active === 2 && (
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Bid History</h3>
            <BidHistory bids={bids} loading={loading} highestBidder={specificNft.highestBidder} />
          </div>
        )}

        {/* Activity */}
        {active === 3 && (
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="text-lg font-bold mb-2">Activity</h3>
            <p className="text-white/70">No activity recorded yet.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(DescriptionPanel);

const DetailItem = React.memo(
  ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-center gap-3 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
      {icon}
      <div className="flex flex-col">
        <span className="text-xs text-white/70">{label}</span>
        {value && <span className="font-semibold text-white">{value}</span>}
      </div>
    </div>
  ),
);
