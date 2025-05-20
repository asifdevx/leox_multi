import { configureStore } from "@reduxjs/toolkit";
import nftReducer from "@/reducer/nftSlice";

export const store = configureStore({
  reducer: {
    nft: nftReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
