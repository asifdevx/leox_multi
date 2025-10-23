import { fetchGraphQL } from '@/api/graphql';
import { GET_BID_HISTORY } from '@/config/graphql';
import * as t from '@/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { createEthContract } from './nftSlice';


export const buyToken = createAsyncThunk(
  'buy/token',
  async ({ tokenId, seller, quantity, totalPrice }: t.BuyTokenProps, { rejectWithValue }) => {
    try {
      const contract = await createEthContract();
      if (!contract) return rejectWithValue('Ethereum contract not available');
      const buyNft = await contract.buy(tokenId, seller, quantity, {
        value: ethers.parseEther(totalPrice.toString()),
      });
      await buyNft.wait();
      return { tokenId, seller, quantity };
    } catch (error: any) {
      return rejectWithValue(error?.message || ' buyToken Failed');
    }
  },
);

export const bidToken = createAsyncThunk(
  'buy/bidToken',
  async ({ tokenId, seller, bidder, bidAmount }: t.BidTokenProps, { rejectWithValue }) => {
    try {
      const contract = await createEthContract();

      if (!contract) return rejectWithValue('Ethereum contract not available');
      const tx = await contract.bid(tokenId, seller, {
        value: ethers.parseEther(bidAmount.toString()),
      });
      await tx.wait();

      return { tokenId, seller, bidder, bidAmount };
    } catch (error: any) {
      return rejectWithValue(error?.message || ' bidToken Failed');
    }
  },
);

export const claimAuction = createAsyncThunk(
  'auction/claim',
  async ({ tokenId, seller }: { tokenId: number; seller: string }, { rejectWithValue }) => {
    try {
      const contract = await createEthContract();

      if (!contract) return rejectWithValue('Ethereum contract not available');
      const tx = await contract.claimAuction(tokenId, seller);
      if (!tx) throw new Error('Transaction failed to initialize.');
      await tx.wait();
      return { success: true, txHash: tx.hash };
    } catch (error: any) {
      return rejectWithValue(error?.message || ' claimAuction Failed');
    }
  },
);

export const getBidHistory = createAsyncThunk(
  'buy/getBidHistory',
  async ({ tokenId, seller }: { tokenId: string; seller: string }, { rejectWithValue }) => {
    try {
      const data = await fetchGraphQL<{ getBids: t.getBidsProps }>(GET_BID_HISTORY, {
        tokenId,
        seller,
      });
      const bids = data?.getBids.bids || [];

      return { tokenId, seller, bids };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch bid history');
    }
  },
);

const initialState: t.BuyInitialStateProps = {
  bidHistory: {},
  loading: false,
  error: null,
};

const buySlice = createSlice({
  name: 'buy',
  initialState,
  reducers: {
    addBidEvent(state, action) {
      const { tokenId, seller, bids } = action.payload;
   
      state.bidHistory[tokenId] = state.bidHistory[tokenId] || {};
      state.bidHistory[tokenId][seller] = state.bidHistory[tokenId][seller] || [];
      state.bidHistory[tokenId][seller] = bids.map((b: any) => ({
        bidder: b.bidder,
        bid: b.bid,
        claim: b.claim || false,
        createdAt: b.createdAt,
      }));

      state.bidHistory[tokenId][seller].sort((a, b) => parseFloat(b.bid) - parseFloat(a.bid));
    },
    updateBidder(state, action) {
      const { tokenId, seller, bidder, claim = true } = action.payload;
      const sellerBids = state.bidHistory[tokenId][seller.toLowerCase()];
      if (!sellerBids) return;
      const index = sellerBids.findIndex((b: any) => b.bidder === bidder);

      if (index >= 0) {
        sellerBids[index].bid = 0;
        sellerBids[index].claim = claim;
        sellerBids[index].updatedAt = new Date().toISOString();
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(buyToken.pending, (s) => {
        (s.loading = true), (s.error = null);
      })
      .addCase(buyToken.fulfilled, (s) => void (s.loading = false))
      .addCase(buyToken.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload as string;
      })
      .addCase(bidToken.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(bidToken.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(bidToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getBidHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBidHistory.fulfilled, (state, action) => {
        state.loading = false;
        const { tokenId, seller, bids } = action.payload;
        state.bidHistory[tokenId] = state.bidHistory[tokenId] || {};
        state.bidHistory[tokenId][seller] = bids.map((b) => ({
          bidder: b.bidder,
          bid: b.bid,
          claim: b.claim,
          createdAt: b.createdAt,
        }));
        state.bidHistory[tokenId][seller].sort((a, b) => parseFloat(b.bid) - parseFloat(a.bid));
      })
      .addCase(getBidHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(claimAuction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(claimAuction.fulfilled, (state) => {
        state.loading = false;
        
      })
      .addCase(claimAuction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addBidEvent, updateBidder } = buySlice.actions;
export default buySlice.reducer;
