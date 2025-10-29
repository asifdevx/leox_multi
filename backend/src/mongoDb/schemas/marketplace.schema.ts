import mongoose from "mongoose";

const nftSchema = new mongoose.Schema({
  tokenId: { type: String, required: true },
  seller: { type: String, lowercase: true },
  username: String,
  owner: { type: String,lowercase: true },
  name: String,
  description: String,
  image: String,
  price: String,
  supply: String,
  remainingSupply: Number,
  isListed: Boolean,
  saleType: Number,
  auctionStartTime: Number,
  auctionEndTime: Number,
  highestBidder: String,
  highestBid: String,
  claimed: Boolean,
  tokenURI: String,
  updatedAt: { type: Date, default: Date.now },
});
nftSchema.index({ tokenId: 1, seller: 1 }, { unique: true });
nftSchema.index({ owner: 1 });
nftSchema.index({ seller: 1, isListed: 1 });

const feeSchema = new mongoose.Schema({
  fee: { type: Number, required: true },
  updateAt: { type: Date, default: Date.now },
  txhase: { type: Number, required: true },
});

const UserInfo = new mongoose.Schema(
  {
    name: { type: String, trim: true,lowercase:true },
    gmail: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    address: { type: String, required: true, lowercase: true, unique: true },
    roles: {
      type: [String],
      enum: ["Buyer", "Seller", "Admin", "Moderator", "Ban"],
      default: ["Buyer"],
    },
    isFirstTime: {
      type: Boolean,
      default: true,
    },
    follower:{type:Number,default:0},
    following:{type:Number,default:0},
    
  },
  { timestamps: true }
);
const BidSchema = new mongoose.Schema({
  tokenId: { type: String, required: true },
  seller: { type: String, lowercase: true,required: true },
  bids: [
    {
      bidder: { type: String,lowercase: true },
      bid: { type: Number },
      txHash: { type: String },
      claim: {type:Boolean,default:false},
      createdAt: { type: Date, default: Date.now },
    },
  ],
});
BidSchema.index({ tokenId: 1, seller: 1, 'bids.bidder': 1 });

export const NFT = mongoose.model("Nfts", nftSchema);
export const Fee = mongoose.model("MarketplaceFee", feeSchema);
export const UsersInfo = mongoose.model("UserInfos", UserInfo);
export const Bid = mongoose.model("Bid", BidSchema);
