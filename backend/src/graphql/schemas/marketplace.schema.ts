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
      args: {
        address: { type:new GraphQLNonNull (GraphQLString) },
      },
      resolve: async (_, {address }) => {
        
        let user = await findUser(address);
        if (!user) {
          console.log("he is first time");
          user = await createUser({
            name:"Anonymous",
            address,
            roles: ["Buyer"],
          });
        }
        console.log("user", user.toObject());
        return user.toObject ? user.toObject() : user;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "mutation",
  fields: {
    updateInfo:{
      type:UserInfoType,
      args:{
        address: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        gmail: { type: GraphQLString },
        role: { type: GraphQLString },      
        action: { type: GraphQLString }, 
      },
      resolve:async(_,{address, name, gmail, role, action})=>{
        let user = await findUser(address.toLowerCase());
        if(!user) { 
          user = await createUser({
            address,
            name:name || "anonyomus",
            gmail:gmail || "",
            roles:role && action =="add" ? [role] : ["Buyer"]
          })
        }else{
          if(gmail) user.gmail=gmail;
          if(name) user.name=name;
          
          if(role){
            if(action == "add" && !user.roles.includes(role)){
              user.roles.push(role);
            }else if(action == "remove"){
              user.roles=user.roles.filter(r=>r!==role)
            }else if (action == "add" && action == "remove"){
              throw new Error("Invalid action, must be 'add' or 'remove'");
            }
          }
        }
        await user.save();
      return user;

      }
    }
  },
});

export const marketplace = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
