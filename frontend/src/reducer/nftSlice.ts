import dotenv from "dotenv";
import * as ethers from "ethers";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import abi from "@/components/ABI/abi.json";
import { CreateNFTArgs, NFT, NftState } from "@/types";
import { fetchGraphQL } from "@/api/graphql";
import { GET_NFT } from "@/config/graphql";

dotenv.config();

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const createEthContract = async () => {
  if (!window.ethereum) return;
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS!, abi, signer);
};

export const createNFT = createAsyncThunk(
  "nft/createNFT",
  async ({ tokenURI, supply, price,saleType,auctionDuration   }: CreateNFTArgs) => {
    try {
      const contract = await createEthContract();
      const duration = saleType === "Fixed" ? 0 : Math.floor(auctionDuration);
      console.log("duration",duration);
      
      const saleTypeString = saleType === "Fixed" ? "Fixed" : "Auction";
      console.log("saleTypeString",saleTypeString);
      
      const tx = await contract?.mint(
        tokenURI,
        supply,
        ethers.parseEther(price.toString()),
        saleTypeString,
        duration 
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
  NFT[],
  { start: number; limit: number; sortBy?: string }
>("nft/fetchNFT", async ({ start, limit, sortBy }) => {
  const data = await fetchGraphQL<{ nfts: NFT[] }>(GET_NFT, {
    start,
    limit,
    sortBy,
  });
  console.log("nft Datas", data?.nfts || []);

  return data?.nfts || [];
});

const initialState: NftState = {
  listings: [],
  loading: false,
  error: null,
  hasMore: true,
  offset: 0,
  limit: 10,
  sortBy: "recent",
};

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
    setSortBy(state, action) {
      state.sortBy = action.payload;
      state.listings = [];
      state.offset = 0;
      state.hasMore = true;
    },
    addNewNFT(state, action) {
      const newNFT = action.payload;
      const key = `${newNFT.tokenId}-${newNFT.seller}`;
      const exists = state.listings.some(
        (item) => `${item.tokenId}-${item.seller}` === key
      );

      if (!exists) {
        // Add the new NFT to the beginning (most recent first)
        state.listings.unshift(newNFT);
        state.offset += 1;
      }
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

        let fetched: NFT[] = action.payload || [];

        const existingKeys = new Set(
          state.listings.map((i) => `${i.tokenId}-${i.seller}`)
        );
        const newUnique = fetched.filter(
          (item) => !existingKeys.has(`${item.tokenId}-${item.seller}`)
        );

        state.listings.push(...newUnique);
        state.offset += newUnique.length;
        state.hasMore = fetched.length === state.limit
      })
      .addCase(fetchNFT.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch listings";
      });
  },
});

export const { resetListings, setSortBy, addNewNFT } = nftSlice.actions;
export default nftSlice.reducer;
