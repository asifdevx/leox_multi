import {
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
      resolve: async()=>{
        return await getNFTs(0, 10);
      }
    }
  },
});


export const nftSchema = new GraphQLSchema({
  query: RootQuery,

});
