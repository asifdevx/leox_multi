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
  updatedAt: { type: Date, default: Date.now },
});
nftSchema.index({ tokenId: 1, seller: 1 }, { unique: true });

const feeSchema = new mongoose.Schema({
  fee: { type: Number, require: true },
  updateAt: { type: Date, default: Date.now },
  txhase: { type: Number, require: true },
});

const UserInfo = new mongoose.Schema(
  {
    name: { type: String,  trim: true },
    gmail: { type: String, trim: true, lowercase: true ,unique:true,sparse:true,
    },
    address: { type: String, required: true,lowercase:true, unique: true },
    roles: {
      type: [String],
      enum: ["Buyer", "Seller", "Admin", "Moderator"],
      default: ["Buyer"],
    },
    isFirstTime: { 
      type: Boolean, 
      default: true,
    },
  },
  { timestamps: true }
);

export const NFT = mongoose.model("Nfts", nftSchema);
export const Fee = mongoose.model("MarketplaceFee", feeSchema);
export const UsersInfo = mongoose.model("UserInfos", UserInfo);
