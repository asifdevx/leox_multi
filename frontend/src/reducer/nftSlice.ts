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
  async ({ tokenURI, supply, price }: CreateNFTArgs,{dispatch}) => {
    try {
      const contract = await createEthContract();
      const tx = await contract?.mint(
        tokenURI,
        supply,
        ethers.parseEther(price.toString())
      );
      if (!tx) throw new Error("Transaction failed to initialize.");
      await tx.wait();
      dispatch(fetchNFT({start:0,limit:10}));
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
 
  const data = await fetchGraphQL<{ nfts: NFT[] }>(GET_NFT,{start,limit});
  return data?.nfts || [];
});




const initialState: NftState = {
  listings: [],
  loading: false,
  error: null,
  hasMore: true,
  offset: 0,
  limit: 10,

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
        console.log(fatchData, "fatchData");
        if (fatchData.length ===0 || fatchData.length < state.limit) {
          console.log(fatchData.length,"+",state.limit);
          
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
        state.offset += newUniqueListings.length;
      })
      .addCase(fetchNFT.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch listings";
      })
  
     
  },
});
export default nftSlice.reducer;
