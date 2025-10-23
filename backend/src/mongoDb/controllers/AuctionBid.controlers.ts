
import { Bid, NFT } from '../schemas/marketplace.schema';
import { newBuyer } from './nft.controlers';
import { findNFT } from './userInfo.controlers';

interface updateBidProps {
  tokenId: string;
  seller: string;
  bidder: string;
  claim: boolean;
  totalBid: number;
  txHash: string;
}

//find the current nft with bids
export const findAuctionNft = async ({ tokenId, seller }: { tokenId: string; seller: string }) =>
  await Bid.findOne({ tokenId, seller: seller.toLowerCase() }).lean();

export const bids = async ({
  tokenId,
  seller,
  bidder,
  totalBid,
  claim,
  txHash,
}: updateBidProps) => {
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
          'bids.$.claim':claim,
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
            claim,
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
  tokenId: number,
  seller: string,
  highestBidder: string,
  caller: string,
  io:any
) => {
  try {
    const tokenStr = tokenId.toString();
    const lowerSeller = seller.toLowerCase();
    const lowerHighestBidder = highestBidder.toLowerCase();
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

    // Fetch NFT data
    const nft = await findNFT({ tokenId: tokenStr, seller: lowerSeller });
    if (!nft) {
      console.warn(`⚠️ NFT not found: tokenId ${tokenId}, seller ${seller}`);
      return;
    }

    const hasWinner = lowerHighestBidder !== ZERO_ADDRESS;
    let buyerNFT = null;


    if (hasWinner) {
     
      const isSellerOrWinner = caller === lowerSeller || caller === lowerHighestBidder;

      if (isSellerOrWinner) {
        // Mark NFT as claimed
        await NFT.findOneAndUpdate(
          { tokenId: tokenStr, seller: lowerSeller },
          { $set: { claimed: true, updatedAt: new Date() ,isListed:false } },
        );

        // Create/update buyer record for winner
        
        await handleBidRefunded(tokenId, lowerSeller, lowerHighestBidder,io);

         buyerNFT = await newBuyer({
          tokenId: tokenStr,
          seller: lowerSeller,
          buyer: lowerHighestBidder,
          quantity: 1,
        });
        console.log(`✅ NFT claimed: token ${tokenId}, winner ${highestBidder}`);
      }

      io.emit("AuctionClaimed",{
        tokenId:tokenId.toString(),
        seller:seller.toLowerCase(),
        caller,
        highestBidder:lowerHighestBidder,
        buyerNFT: buyerNFT || null

      })



    } else {
      // No bids, highestBidder is 0x0
      console.log(`⚠️ Auction ended with no bids: token ${tokenId}`);
      await NFT.findOneAndUpdate(
        { tokenId: tokenStr, seller: lowerSeller },
        { $set: { claimed: false, updatedAt: new Date(),isListed:false } },
      );
    }
  } catch (error) {
    console.error('❌ Error handling AuctionClaimed:', error);
  }
};

export const handleBidRefunded = async (tokenId: number, seller: string, caller: string,io:any) => {
  try {
    const tokenStr = tokenId.toString();
    const lowerSeller = seller.toLowerCase();
    const lowerCaller = caller.toLowerCase();

    const updatedBid = await Bid.findOneAndUpdate(
      {
        tokenId: tokenStr,
        seller: lowerSeller,
        'bids.bidder': lowerCaller,
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
    if (!updatedBid) {
      console.warn(
        `⚠️ No bid found for token ${tokenStr}, seller ${lowerSeller}, bidder ${lowerCaller}`,
      );
      return;
    }
    io.emit('BidRefunded', {
      tokenId: tokenStr,
      seller: lowerSeller,
      caller: lowerCaller,
    });
  } catch (error) {
    console.log(error);
  }
};
