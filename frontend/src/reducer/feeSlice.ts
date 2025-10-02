import { getFeeHistory } from "@/api/api";
import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createEthContract } from "./nftSlice";
import { FeeState } from "@/types";


export const fatchFee = createAsyncThunk(
  "marketplace/fee",
  async () => {
    return await getFeeHistory();
  }
);
export const changeFee = createAsyncThunk(
  "marketplace/updateFee",
  async (fee: number) =>{
   try {
    const contract = await createEthContract();
    const tx = await contract?.updateMarketplaceFee(fee);
    await tx.wait();
    return {fee};
   } catch (error) {
    console.log("failed to fatch data of ",error);
    return {fee : 0}
   }

    
  });

const initialState: FeeState = {
  history:[],
  status: "idle",

};

const feeSlice = createSlice({
  name: "fee",
  initialState,
  reducers: {
    setFeeHistory(state,action){
      if(state.history[0].fee !== action.payload.fee ){
        state.history.unshift(action.payload);
        if(state.history.length > 3 ) {
          state.history.pop();
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fatchFee.fulfilled, (state, action) => {
    
      state.history=action.payload;
      state.status="succeeded";
      })
      .addCase(changeFee.fulfilled, (state,action) => {
                 
        if (state.history[0]?.fee !== action.payload.fee/10) {
                    
            state.history.unshift({
              fee:action.payload.fee/10,
              updateAt:new Date().toISOString(),
              txHash: null,
            });
            if(state.history.length > 3 ) {
              state.history.pop();
            }
          }
          state.status="succeeded";
      });
  },
});

export const { setFeeHistory } = feeSlice.actions;
export default feeSlice.reducer;
