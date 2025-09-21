import mongoose from "mongoose";

const nftSchema = new mongoose.Schema({

  tokenId: { type: String, required: true },
  seller: { type: String },
  owner: { type: String },
  name: String,
  description: String,
  image: String,
  price: String,
  supply: String,
  remainingSupply: Number,
  isListed: Boolean,
  saleType: Number,
  auctionEndTime: Number,
  highestBidder: String,
  highestBid: String,
  claimed: Boolean,
  tokenURI: String,
  updatedAt: { type: Date, default: Date.now }
});


nftSchema.index({ tokenId: 1, seller: 1 }, { unique: true });

const NFT =mongoose.model("Nfts",nftSchema);

export default NFT;
