import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { NftType, UserInfoType, BidType, userProfile } from '../types/nft.type';
import { getNFTs } from '../../mongoDb/controllers/nft.controlers';
import {
  createUser,
  findUser,
  userProfileInfo,
} from '../../mongoDb/controllers/userInfo.controlers';
import { findAuctionNft } from '../../mongoDb/controllers/AuctionBid.controlers';
import { NFT, UsersInfo } from '../../mongoDb/schemas/marketplace.schema';

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    nfts: {
      type: new GraphQLList(NftType),
      args: {
        start: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        sortBy: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const start = Number.isInteger(args?.start) ? args.start : 0;
        const limit = Number.isInteger(args?.limit) ? args.limit : 10;
        const sortBy = args?.sortBy || 'recent';
        return await getNFTs(start, limit, sortBy);
      },
    },
    getUserInfo: {
      type: UserInfoType,
      args: { address: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (_, { address }) => {
        const normalizedAddress = address.toLowerCase();

        let user = await findUser(normalizedAddress);

        if (!user) {
          user = await createUser({
            name: 'Anonymous',
            address: normalizedAddress,
            roles: ['Buyer'],
            isFirstTime: true,
            follower: 0,
            following: 0,
          });
        }
        console.log('User', user);

        return user.toObject ? user.toObject() : user;
      },
    },
    getBids: {
      type: BidType,
      args: {
        tokenId: { type: new GraphQLNonNull(GraphQLString) },
        seller: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { tokenId, seller }) => {
        const bidDoc = await findAuctionNft({ tokenId, seller });

        return bidDoc;
      },
    },

    userProfile: {
      type: userProfile,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { name }) => await userProfileInfo(name),
    },
  },
});
const Mutation = new GraphQLObjectType({
  name: 'mutation',
  fields: {
    updateInfo: {
      type: UserInfoType,
      args: {
        address: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        gmail: { type: GraphQLString },
        roles: { type: new GraphQLList(GraphQLString) },
      },
      resolve: async (_, { address, name, gmail, roles }) => {
        let user = await findUser(address.toLowerCase());

        if (!user) {
          // create new user
          user = await createUser({
            address,
            name: name || 'Anonymous',
            gmail: gmail || null,
            roles: roles?.length ? roles : ['Buyer'],
          });
        } else {
          // update existing user
          if (name) user.name = name;
          if (gmail) user.gmail = gmail;
          if ((name && name !== 'Anonymous') || gmail) user.isFirstTime = false;

          if (roles?.length) {
            user.roles = roles;
          }
          if (!user.roles?.length) user.roles.push('Buyer');
        }

        await user.save();

        if (name) {
          await NFT.updateMany({ seller: address.toLowerCase() }, { $set: { username: name } });
          console.log(`✅ Updated NFTs for ${address} with new username ${name}`);
        }

        return user.toObject ? user.toObject() : user;
      },
    },
  },
});

export const marketplace = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
