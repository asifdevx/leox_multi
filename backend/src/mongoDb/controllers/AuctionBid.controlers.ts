import { Bid, NFT } from '../schemas/marketplace.schema';
import { newBuyer } from './nft.controlers';
import { findNFT } from './userInfo.controlers';

interface updateBidProps {
  tokenId: string;
  seller: string;
  bidder: string;
  totalBid: number;
  txHash: string;
}

//find the current nft with bids
export const findAuctionNft = async ({ tokenId, seller }: { tokenId: string; seller: string }) =>
  await Bid.findOne({ tokenId, seller: seller.toLowerCase() }).lean();

export const bids = async ({ tokenId, seller, bidder, totalBid, txHash }: updateBidProps) => {
  const lowerSeller = seller.toLowerCase();
  const lowerBidder = bidder.toLowerCase();

  const alreadyBids = await Bid.findOne({
    tokenId,
    seller: lowerSeller,
    'bids.bidder': lowerBidder,
  });
  console.log('alreadyBids', alreadyBids);

  if (alreadyBids) {
    await Bid.updateOne(
      { tokenId, seller: lowerSeller, 'bids.bidder': lowerBidder },
      {
        $set: {
          'bids.$.bid': totalBid,
          'bids.$.createdAt': new Date(),
          'bids.$.txHash': txHash,
        },
      },
    );
  } else {
    await Bid.findOneAndUpdate(
      { tokenId, seller: lowerSeller },
      {
        $push: {
          bids: {
            bidder: lowerBidder,
            bid: totalBid,
            txHash,
            createdAt: new Date(),
          },
        },
      },
      { upsert: true, new: true },
    );
  }
};

//when bid change check is it highestbid then update

export const changeHigestBiderInfo = async (
  tokenId: string,
  seller: string,
  totalBid: number,
  bidder: string,
) => {
  try {
    const result = await NFT.findOneAndUpdate(
      {
        tokenId,
        seller: seller.toLowerCase(),
        $or: [{ highestBid: { $lt: totalBid } }],
      },
      {
        $set: {
          highestBid: totalBid.toString(),
          highestBidder: bidder.toLowerCase(),
          updatedAt: new Date(),
        },
      },
      { new: true },
    );

    if (result) {
      console.log(
        `🏆 Updated highest bid for token ${tokenId} (${seller}): ${totalBid} from ${bidder}`,
      );
    } else {
      console.log(`⚠️ Bid ${totalBid} not higher than current highest for token ${tokenId}`);
    }
  } catch (error) {
    console.error('❌ Error updating highest bidder info:', error);
  }
};
export const handleAuctionClaimed = async (
  tokenId: string,
  seller: string,
  highestBidder: string, // address(0) if no bids
  event: any,
) => {
  try {
    const tx = await event.log.getTransaction();
    const caller = tx.from.toLowerCase();
    const tokenStr = tokenId.toString();
    const lowerSeller = seller.toLowerCase();

    // Fetch NFT data
    const nft = await findNFT({ tokenId: tokenStr, seller: lowerSeller });
    if (!nft) {
      console.warn(`⚠️ NFT not found: tokenId ${tokenId}, seller ${seller}`);
      return;
    }

    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

    // Check if there was a highest bidder
    const hasWinner = highestBidder.toLowerCase() !== ZERO_ADDRESS;

    if (hasWinner) {
      const lowerHighestBidder = highestBidder.toLowerCase();
      const isSellerOrWinner =
        caller === lowerSeller || caller === lowerHighestBidder;

      if (isSellerOrWinner) {
        // Mark NFT as claimed
        await NFT.findOneAndUpdate(
          { tokenId: tokenStr, seller: lowerSeller },
          { $set: { claimed: true, updatedAt: new Date() } },
        );

        // Create/update buyer record for winner
        if (caller === lowerHighestBidder) {
          await newBuyer({
            tokenId: tokenStr,
            seller: lowerSeller,
            buyer: lowerHighestBidder,
            quantity: 1,
          });
        }

        console.log(`✅ NFT claimed: token ${tokenId}, winner ${highestBidder}`);
      }

      // Reset caller's bid
      await Bid.findOneAndUpdate(
        {
          tokenId: tokenStr,
          seller: lowerSeller,
          'bids.bidder': caller,
        },
        {
          $set: {
            'bids.$.bid': 0,
            'bids.$.updatedAt': new Date(),
            'bids.$.claim': true,
          },
        },
        { new: true },
      );
    } else {
      // No bids, highestBidder is 0x0
      console.log(`⚠️ Auction ended with no bids: token ${tokenId}`);
      await NFT.findOneAndUpdate(
        { tokenId: tokenStr, seller: lowerSeller },
        { $set: { claimed: false, updatedAt: new Date() } },
      );
    }
  } catch (error) {
    console.error('❌ Error handling AuctionClaimed:', error);
  }
};