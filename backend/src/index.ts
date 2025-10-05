import { createServer } from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import connetdb from "./config/connectdb";
import { graphqlHTTP } from "express-graphql";
import Marketplace from "./mongoDb/router/Marketplace.router";
import { marketplace } from "./graphql/schemas/marketplace.schema";
import { feeListener } from "./mongoDb/controllers/listener.controlers";
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 8000;

app.use(express.json());

const corsOptions = {
  origin: "http://10.98.0.173:3000",
  credentials: true,
};
app.use(cors(corsOptions));

export const io = new Server(httpServer, {
  cors: { 
    origin: "http://10.98.0.173:3000",
    methods: ["GET", "POST"],
    credentials: true,
   },
});

app.get("/", (req, res) => {
  res.send("Welcome to the GraphQL API!");
});
app.use("/api", Marketplace);
app.use("/g", graphqlHTTP({ schema: marketplace, graphiql: true }));

const start = async () => {
  try {
    await connetdb();
    httpServer.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
    await feeListener();
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

start();
