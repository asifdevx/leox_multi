import { configureStore } from "@reduxjs/toolkit";
import nftReducer from "@/reducer/nftSlice";
import feeReducer from "@/reducer/feeSlice";
import roleReducer from "@/reducer/roleSlice";

export const store = configureStore({
  reducer: {
    nft: nftReducer,
    fee:feeReducer,
    userRole:roleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
