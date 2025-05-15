import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

export const productType = new GraphQLObjectType({
  name: "productType",
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});
