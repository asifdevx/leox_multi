import {
  GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
 
} from "graphql";
import {NftType, UserRoleType} from "../types/nft.type";
import {getNFTs} from "../../mongoDb/controllers/nft.controlers";
import {createRole, findRole} from "../../mongoDb/controllers/userRole.controlers";



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
        console.log(start,limit);
        
        return await getNFTs(start,limit);
      }
    },
    getUserRole:{
      type : UserRoleType,
      args:{
        address:{type:GraphQLString}
      },
      resolve:async(_,args)=>{
        let user = await findRole(args.address);
        console.log("user",user);
        
    if (!user) {
      console.log("he is first time");
      
      user = await createRole({ address: args.address, roles: ["Buyer"] });
    }
    return user;
  
      }
    }
  },
});

const Mutation = new GraphQLObjectType({
  name:"mutation",
  fields:{
    addRole:{
      type:UserRoleType,
      args:{
        address: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: new GraphQLNonNull(GraphQLString) }, 
      },
      resolve:async(_,{address,role})=>{
        const userExist = await findRole(address);
        if(!userExist){
          await createRole({address,roles:[role]})
        }
        if(!userExist.roles.includes(role)){
          userExist.roles.push(role);
          await userExist.save();
        }
        return userExist;
      
      }
    },
    removeRole : {
      type:UserRoleType,
      args:{
        address: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: new GraphQLNonNull(GraphQLString) }, 
      },
      resolve:async(_,{address,role})=>{
        const userExist = await findRole(address);
        if(!userExist) throw new Error("user not found");
        userExist.roles=userExist.roles.filter((r)=>r !==role);
        await userExist.save();
        return userExist;
      }
    }
  },
})

export const marketplace = new GraphQLSchema({
  query: RootQuery,
  mutation:Mutation
});
