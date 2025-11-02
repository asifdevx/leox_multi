import dotenv from "dotenv";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { CreateNFTArgs, NFT, NftState, reSellNftProps } from "@/types";
import { fetchGraphQL } from "@/api/graphql";
import { GET_NFT } from "@/config/graphql";
import { createEthContract } from "@/hooks/CreateEthContract";

dotenv.config();

// 🪙 Create or reuse contract instance


export const reSellNft =createAsyncThunk("nft/resell",async({tokenId,quantity,newPrice}:reSellNftProps)=>{
  const contract = await createEthContract();
  const tx = await contract.resellToken(tokenId,quantity,ethers.parseEther(newPrice.toString()));
  await tx.wait(1);
  return { success: true, txHash: tx.hash };
})

export const unlist =createAsyncThunk("nft/unlist",async({tokenId,seller}:{tokenId:number,seller:string})=>{
  const contract = await createEthContract();
  const tx = await contract.unlist(tokenId,seller);
  await tx.wait(1);
  return { success: true, txHash: tx.hash };
})

export const startAuctionNft = createAsyncThunk(
  "nft/startAuctionNft",
  async ({ tokenId,minPrice ,auctionDuration }: {tokenId:number,minPrice:number,auctionDuration:number}) => {
    const contract = await createEthContract();
    const duration = Math.floor(auctionDuration);
    const tx = await contract.startAuction(
      tokenId,
      ethers.parseEther(minPrice.toString()),
      duration
    );
    await tx.wait(1);
    return { success: true, txHash: tx.hash };
  }
);

// 🧱 Mint NFT
export const createNFT = createAsyncThunk(
  "nft/createNFT",
  async ({ tokenURI, supply, price, saleType, auctionDuration }: CreateNFTArgs) => {
    const contract = await createEthContract();
    const duration = saleType === "Fixed" ? 0 : Math.floor(auctionDuration);
    const tx = await contract.mint(
      tokenURI,
      supply,
      ethers.parseEther(price.toString()),
      saleType,
      duration
    );
    await tx.wait(1);
    return { success: true, txHash: tx.hash };
  }
);

// 📦 Fetch NFTs from backend
export const fetchNFT = createAsyncThunk<
  NFT[],
  { start: number; limit: number; sortBy?: string }
>("nft/fetchNFT", async ({ start, limit, sortBy }) => {
  const data = await fetchGraphQL<{ nfts: NFT[] }>(GET_NFT, { start, limit, sortBy });
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
    updateListing(state, { payload }) {
      const { tokenId, seller, remainingSupply,isListed } = payload;
      const listing = state.listings.find(
        (e) => e.tokenId == tokenId && e.seller.toLowerCase() === seller.toLowerCase()
      );
      if (listing) {
    
        Object.assign(listing, { remainingSupply, isListed });
      }
    },
    updateAuctionEnd(state, { payload }) {
      const { tokenId, seller } = payload;
      console.log(seller,"s");
      const listing = state.listings.find(
        (e) => e.tokenId == tokenId.toString() && e.seller.toLowerCase() === seller.toLowerCase()
      );
      if (listing) {
      console.log(listing.isListed,"s");

        Object.assign(listing, {
          claimed: true,
          isListed: false,
          updatedAt: new Date().toISOString(),
        });

      console.log(listing.isListed,"s");

      }
    },
    updateBidInfo(state, { payload }) {
      const { tokenId, seller, highestBid, highestBidder } = payload;
      const listing = state.listings.find(
        (e) => e.tokenId == tokenId && e.seller.toLowerCase() === seller.toLowerCase()
      );
      if (listing) {
        Object.assign(listing, {
          highestBidder,
          highestBid: ethers.parseEther(highestBid.toString()).toString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        console.warn(`⚠️ No listing found for token ${tokenId}, seller ${seller}`);
      }
    },
    resetListings(state) {
      Object.assign(state, {
        listings: [],
        offset: 0,
        hasMore: true,
        error: null,
      });
    },
    setSortBy(state, { payload }) {
      Object.assign(state, {
        sortBy: payload,
        listings: [],
        offset: 0,
        hasMore: true,
      });
    },
    addNewNFT(state, { payload: newNFT }) {
      const exists = state.listings.some(
        (i) => `${i.tokenId}-${i.seller}` === `${newNFT.tokenId}-${newNFT.seller}`
      );
      if (!exists) {
        state.listings.unshift(newNFT);
        state.offset += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNFT.pending, (s) => void (s.loading = true))
      .addCase(createNFT.fulfilled, (s) => void (s.loading = false))
      .addCase(createNFT.rejected, (s) => void (s.loading = false))
      .addCase(fetchNFT.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchNFT.fulfilled, (s, { payload }) => {
        s.loading = false;
        const newItems = payload.filter(
          item => !s.listings.some(i => `${i.tokenId}-${i.seller}` === `${item.tokenId}-${item.seller}`)
        );
        s.listings.push(...newItems);
        s.offset += newItems.length;
        s.hasMore = newItems.length === s.limit;
      })
      .addCase(fetchNFT.rejected, (s) => {
        s.loading = false;
        s.error = "Failed to fetch listings";
      })
      
  },
});

export const {
  resetListings,
  setSortBy,
  addNewNFT,
  updateListing,
  updateBidInfo,
  updateAuctionEnd,
} = nftSlice.actions;

export default nftSlice.reducer;
