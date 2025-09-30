
import { getFee } from "@/api/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createEthContract } from "./nftSlice";


export const fatchFee = createAsyncThunk(
  "marketplace/fee",
  async () => await getFee()
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

const initialState: { value: number; status: "idle" | "succeeded" } = {
  value: 0,
  status: "idle",
};

const feeSlice = createSlice({
  name: "fee",
  initialState,
  reducers: {
    setFee(state, action) {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fatchFee.fulfilled, (state, action) => {
        state.value = action.payload.fee;
        state.status = "succeeded";
      })
      .addCase(changeFee.fulfilled, (state,action) => {
        state.value = action.payload?.fee;
        state.status = "succeeded";
      });
  },
});

export const { setFee } = feeSlice.actions;
export default feeSlice.reducer;
