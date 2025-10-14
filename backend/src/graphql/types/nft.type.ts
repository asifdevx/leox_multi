import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} from "graphql";

export const NftType = new GraphQLObjectType({
  name: "nft",
  fields: {
    tokenId: { type: GraphQLString },
    seller: { type: GraphQLString },
    owner: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    image: { type: GraphQLString },
    price: { type: GraphQLString },
    isListed: { type: GraphQLBoolean },
    supply: { type: GraphQLString },
    remainingSupply: { type: GraphQLInt },
    saleType: { type: GraphQLInt },
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
    isFirstTime:{type :GraphQLBoolean}
  },
});
