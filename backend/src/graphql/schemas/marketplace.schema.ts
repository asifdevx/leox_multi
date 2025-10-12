import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { NftType, UserInfoType } from "../types/nft.type";
import { getNFTs } from "../../mongoDb/controllers/nft.controlers";
import {
  createUser,
  findUser,
} from "../../mongoDb/controllers/userInfo.controlers";

const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    nfts: {
      type: new GraphQLList(NftType),
      args: {
        start: { type: GraphQLInt },
        limit: { type: GraphQLInt },
      },
      resolve: async (_, arg) => {
        const start = Number.isInteger(arg?.start) ? arg.start : 0;
        const limit = Number.isInteger(arg?.limit) ? arg.limit : 10;
        console.log(start, limit);

        return await getNFTs(start, limit);
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
            name: "Anonymous",
            address: normalizedAddress,
            roles: ["Buyer"],
            isFirstTime:true
          });
        }
        console.log("User",user);
        
        return user.toObject ? user.toObject() : user;
       
      },
    }
  }
});
const Mutation = new GraphQLObjectType({
  name: "mutation",
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
            name: name || "Anonymous",
            gmail: gmail || null,
            roles: roles?.length ? roles : ["Buyer"],
          });
        } else {
          // update existing user
          if (name) user.name = name;
          if (gmail) user.gmail = gmail;
          if ((name && name !== "Anonymous") || gmail) user.isFirstTime = false;

          if (roles?.length) {
            user.roles = roles;
          }
          if (!user.roles?.length) user.roles.push("Buyer");
        }

        await user.save();
        console.log("user", user.toObject());

        return user.toObject ? user.toObject() : user;
      },
    },
  },
});


export const marketplace = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
