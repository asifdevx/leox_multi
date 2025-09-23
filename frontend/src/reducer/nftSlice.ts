import axios from "axios";
import dotenv from "dotenv";
import * as ethers from "ethers";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import abi from "@/components/ABI/abi.json";
import { CreateNFTArgs, NFT, NftState } from "@/types";
import { fetchGraphQL } from "@/api/graphql";
import { getNft } from "@/config/graphql";

dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTACT_ADDRESS;

const createEthContract = async () => {
  if (!window.ethereum) {
    console.error("MetaMask not detected.");
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS!, abi, signer);
};

export const createNFT = createAsyncThunk(
  "nft/createNFT",
  async ({ tokenURI, supply, price }: CreateNFTArgs) => {
    try {
      const contract = await createEthContract();
      const tx = await contract?.mint(
        tokenURI,
        supply,
        ethers.parseEther(price.toString())
      );
      if (!tx) throw new Error("Transaction failed to initialize.");
      await tx.wait();
      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error("Error creating NFT:", error);
      throw error;
    }
  }
);

export const fetchNFT = createAsyncThunk<
  NFT[],  { start: number; limit: number } 
>("nft/fetchNFT", async ({ start, limit }) => {
 
  const data = await fetchGraphQL<{ nfts: NFT[] }>(getNft,{start,limit});
  return data?.nfts || [];
});

export const getMarketplaceFee = createAsyncThunk("nft/fee", async () => {
  const contract = await createEthContract();
  try {
    const feeBigNumber = await contract?.marketplaceFee();
    return Number(feeBigNumber) / 10;
  } catch (error) {
    console.log("couldn't find fee", error);
  }
});

const initialState: NftState = {
  listings: [],
  loading: false,
  error: null,
  hasMore: true,
  offset: 0,
  limit: 2,
  fee: 0,
};

// ------------------ Slice ------------------
const nftSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {
    resetListings(state) {
      state.listings = [];
      state.offset = 0;
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNFT.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNFT.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createNFT.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchNFT.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNFT.fulfilled, (state, action) => {
        state.loading = false;

        const fatchData: NFT[] = action.payload || [];

        if (fatchData.length ===0 || fatchData.length < state.limit) {
          console.log(fatchData.length,"+",state.offset);
          
          state.hasMore = false;
        }

        const existingKeys = new Set(
          state.listings.map((item) => `${item.tokenId}-${item.seller}`)
        );

        const newUniqueListings = action.payload.filter(
          (item) => !existingKeys.has(`${item.tokenId}-${item.seller}`)
        );
        console.log(newUniqueListings, "newUniqueListings");

        state.listings.push(...newUniqueListings);
        state.offset += fatchData.length;
      })
      .addCase(fetchNFT.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch listings";
      })
      .addCase(getMarketplaceFee.fulfilled, (state, action) => {
        state.fee = action.payload;
      })
      .addCase(getMarketplaceFee.rejected, (state) => {
        state.fee = 1;
      });
  },
});
export default nftSlice.reducer;
