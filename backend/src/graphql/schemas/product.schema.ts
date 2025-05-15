import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { productType } from "../types/product.type";
import { ProductType } from "../types";
import {
  addProductData,
  productData,
} from "../../mongoDb/controllers/product.controlers";

const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    //// ALL PRODUCT
    products: {
      type: new GraphQLList(productType),
      resolve: async () => {
        try {
          return await productData();
        } catch (error) {
          console.error("Error resolving products:", error);
          throw new Error("Failed to fetch products.");
        }
      },
    },
    //// Fetch a product by title
    // productsByTitle: {
    //   type: productType,
    //   args: {
    //     title: { type: GraphQLString },
    //   },
    //   resolve: async (_, args) => {
    //     try {
    //       const products = await productData();

    //       const matchedProduct = products.find(
    //         (product: ProductType) =>
    //           product.title.toLowerCase() === args.title.toLowerCase()
    //       );
    //       return matchedProduct || null;
    //     } catch (error) {
    //       console.error("Error fetching product by title:", error);
    //       throw new Error("Failed to fetch product by title.");
    //     }
    //   },
    // },
  },
});

const mutation = new GraphQLObjectType({
  name: "mutation",
  fields: {
    addProduct: {
      type: productType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args) => {
        const products = await productData();
        const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        return await addProductData(newId, args.title, args.description);
      },
    },
  },
});
export const productSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation,
});
