
import * as t from "@/types";
import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";

import { useAccount } from "wagmi";
import { createEthContract } from "./nftSlice";

export const buyToken = createAsyncThunk("buy/token",async({ tokenId, seller, quantity, totalPrice }:t.BuyTokenProps,{rejectWithValue})=>{
  try {
    const contract = await createEthContract();
    if (!contract) return rejectWithValue("Ethereum contract not available");
    const buyNft = await contract.buy(tokenId,seller,quantity,{value:ethers.parseEther(totalPrice.toString())});
    await buyNft.wait();
    return { tokenId, seller, quantity };
  } catch (error:any) {
    return rejectWithValue(error?.message || " buyToken Failed");
  }
})

export const bidToken =createAsyncThunk("buy/bidToken",async({tokenId,seller,bidAmount}:t.BidTokenProps,{rejectWithValue})=>{
  try {
    const contract = await createEthContract();
    if (!contract) return rejectWithValue("Ethereum contract not available");
    const tx = await contract.buy(tokenId,seller,{value:ethers.parseEther(bidAmount.toString())});
    await tx.wait();
    return {tokenId,seller ,bidAmount}
  } catch (error:any) {
    return rejectWithValue(error?.message || " bidToken Failed");
    
  }
})

const initialState:t.BuyInitialStateProps = {
    bidHistory: {},      
    loading: false,
    error: null ,


};

const buySlice = createSlice({
  name: "buy",
  initialState,
  reducers: {
    addBidEvent (state,action) {
      const {tokenId, seller, bidder, bid }=action.payload;
      state.bidHistory[tokenId] = state.bidHistory[tokenId] || {};
      state.bidHistory[tokenId][seller] =state.bidHistory[tokenId][seller] || [];
      state.bidHistory[tokenId][seller].push({bidder,bid})

    }
   
  },
  extraReducers: (builder) => {
    builder.addCase(buyToken.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(buyToken.fulfilled, (state) => {
      state.loading = false;
    })
    .addCase(buyToken.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
     .addCase(bidToken.pending, (state) => {
      state.loading = true;
      state.error = null;
    }) 
    .addCase(bidToken.fulfilled, (state, action) => {
      state.loading = false;
      const { tokenId, seller, bidAmount } = action.payload;
      state.bidHistory[tokenId] = state.bidHistory[tokenId] || {};
      state.bidHistory[tokenId][seller] =
        state.bidHistory[tokenId][seller] || [];
      state.bidHistory[tokenId][seller].push({
        bidder: useAccount().address!,
        bid: bidAmount.toString(),
      })
    }).addCase(bidToken.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
}
});

export const { addBidEvent} = buySlice.actions;
export default buySlice.reducer;
