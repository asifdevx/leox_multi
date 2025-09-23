import express from "express";
import { graphqlHTTP } from "express-graphql";
import dotenv from "dotenv";
import { nftSchema} from "./graphql/schemas/nft.schema";
 import connetdb from "./config/connectdb";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());

const corsOptions = {
  origin: "http://192.168.0.100:3000", 
  credentials: true, 
};
app.use(cors(corsOptions));
// Main backend data
app.get("/", (req, res) => {
  res.send("Welcome to the GraphQL API!");
});
app.use(
  "/g",
  graphqlHTTP({
    schema: nftSchema,
    graphiql: true,
  })
);

const start = async () => {
  try {
    await connetdb()
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

start();
