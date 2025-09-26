import {
  GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
  GraphQLSchema,
 
} from "graphql";
import {NftType} from "../types/nft.type";
import {getNFTs} from "../../mongoDb/controllers/nft.controlers";


const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    nfts:{
      type: new GraphQLList( NftType) ,
      args:{
        start:{type:GraphQLInt},
        limit:{type:GraphQLInt},
      },
      resolve: async(_,arg)=>{
        const start = Number.isInteger(arg?.start) ? arg.start : 0;
        const limit = Number.isInteger(arg?.limit) ? arg.limit : 10;
        return await getNFTs(start,limit);
      }
    }
  },
});

export const nftSchema = new GraphQLSchema({
  query: RootQuery,

});
