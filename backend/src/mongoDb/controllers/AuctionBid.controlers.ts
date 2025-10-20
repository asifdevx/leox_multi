import { Bid } from "../schemas/marketplace.schema";
import { findNFT } from "./userInfo.controlers";

interface updateBidProps {
  tokenId: string;
  seller: string;
  bidder: string;
  totalBid: number;
  txHash: string;
}

//find the current nft with bids
export const findAuctionNft = async ({
  tokenId,
  seller,
}: {
  tokenId: string;
  seller: string;
}) =>await Bid.findOne({ tokenId, seller:seller.toLowerCase()}).lean();

export const bids = async ({
  tokenId,
  seller,
  bidder,
  totalBid,
  txHash,
}: updateBidProps) => {
  const lowerSeller = seller.toLowerCase();
  const lowerBidder = bidder.toLowerCase();

  const alreadyBids = await Bid.findOne({
    tokenId,
    seller:lowerSeller,
    "bids.bidder": lowerBidder,
  });
  console.log("alreadyBids", alreadyBids);

  if (alreadyBids) {
    await Bid.updateOne(
      { tokenId, seller: lowerSeller, "bids.bidder": lowerBidder },
      {
        $set: { "bids.$.bid":totalBid,"bids.$.createdAt": new Date(), "bids.$.txHash": txHash },
      }
    );
  } else {
    await Bid.findOneAndUpdate(
      { tokenId,seller:lowerSeller },
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
      { upsert: true,new:true }
    );
  }
};


//when bid change check is it highestbid then update 

export const changeHigestBiderInfo = async (tokenId:string,seller:string,totalBid:number,bidder:string) => {
  const nftData =await findNFT({tokenId,seller});

  if(nftData && Number(nftData.highestBid) < totalBid ){
    nftData.highestBid = totalBid.toString();
    nftData.highestBidder=bidder.toLowerCase();
    nftData.updatedAt = new Date();
    await nftData.save();
  }
}
