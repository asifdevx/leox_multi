import { createServer } from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import connetdb from "./config/connectdb";
import { graphqlHTTP } from "express-graphql";
import Marketplace from "./mongoDb/router/Marketplace.router";
import { marketplace } from "./graphql/schemas/marketplace.schema";
import { startNFTListener } from "./mongoDb/controllers/listener.controlers";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;



// const allowedOrigin = "https://leox-multi.vercel.app"; 
const allowedOrigin = "http://192.168.1.100:3000"; 

const corsOptions = {
  origin: allowedOrigin,
  credentials: true,
};
app.use(cors(corsOptions));

// ----- Handle Preflight for all routes -----
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: { 
    // origin: "https://leox-multi.vercel.app",
    origin: "http://192.168.1.100:3000",
    methods: ["GET", "POST"],
    credentials: true,
   },
});

app.get("/", (req, res) => res.send("Welcome to the GraphQL API!"));
app.use("/api", Marketplace);
app.use("/g", graphqlHTTP({ schema: marketplace, graphiql: true }));

const start = async () => {
  try {
    await connetdb();
    httpServer.listen({ port: PORT as number, host: "0.0.0.0" }, () => {
      console.log(`Server running on ${corsOptions.origin}:${PORT}`)
    });
    await startNFTListener();
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

start();