import axios from "axios";
import { getFee, updateFee } from "@/api/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fatchFee = createAsyncThunk(
  "marketplace/fee",
  async () => await getFee()
);
export const changeFee = createAsyncThunk(
  "marketplace/updateFee",
  async (fee: number) => await updateFee(fee)
);

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
      .addCase(changeFee.fulfilled, (state) => {
        state.status = "succeeded";
      });
  },
});

export const { setFee } = feeSlice.actions;
export default feeSlice.reducer;
