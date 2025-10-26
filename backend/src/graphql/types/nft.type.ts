import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat,
} from "graphql";

export const NftType = new GraphQLObjectType({
  name: "nft",
  fields: {
    tokenId: { type: GraphQLString },
    seller: { type: GraphQLString },
    username: { type: GraphQLString },
    owner: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    image: { type: GraphQLString },
    price: { type: GraphQLString },
    isListed: { type: GraphQLBoolean },
    supply: { type: GraphQLString },
    remainingSupply: { type: GraphQLInt },
    saleType: { type: GraphQLInt },
    auctionStartTime:{ type: GraphQLInt },
    auctionEndTime: { type: GraphQLInt },
    highestBidder: { type: GraphQLString },
    highestBid: { type: GraphQLString },
    claimed: { type: GraphQLBoolean },
    tokenURI: { type: GraphQLString },
    updatedAt:{type: GraphQLString}
  },
});

export const UserInfoType = new GraphQLObjectType({
  name: "user",
  fields: {
    name:{type:GraphQLString},
    gmail:{type : GraphQLString},
    address: { type: new GraphQLNonNull(GraphQLString) },
    roles: { type: new GraphQLList(GraphQLString) },
    isFirstTime:{type :GraphQLBoolean},
    follower:{type:GraphQLInt},
    following:{type:GraphQLInt},
  },
});


const SingleBidType = new GraphQLObjectType({
  name: "SingleBid",
  fields: {
    bidder: { type: GraphQLString },
    bid: { type: GraphQLFloat },
    txHash: { type: GraphQLString },
    claim:{type:GraphQLBoolean},
    createdAt: { type: GraphQLString },
  },
});
export const BidType = new GraphQLObjectType({
  name: "bid",
  fields:{
    tokenId: { type: new GraphQLNonNull(GraphQLString)},
  seller: { type: new GraphQLNonNull(GraphQLString)},
  bids:{type : new GraphQLList(SingleBidType)}
  }

})


 const minimalUserType = new GraphQLObjectType({
  name: "MinimalUser",
  fields: {
    name:{type:GraphQLString},
    address: { type: GraphQLString },
    roles: { type: new GraphQLList(GraphQLString) },
    follower:{type:GraphQLInt},
    following:{type:GraphQLInt},
  },
});

 const ProfileNFTsType = new GraphQLObjectType({
  name: "ProfileNFTsType",
  fields: {
    owned: { type: new GraphQLList(NftType) },
    sale: { type: new GraphQLList(NftType) },
    created: { type: new GraphQLList(NftType) },
    sold: { type: new GraphQLList(NftType) },
  },
});
export const userProfile = new GraphQLObjectType({
  name:"userProfile",
  fields:{
    user:{ type: minimalUserType },
    nfts: { type: ProfileNFTsType }
  }
})