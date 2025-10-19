import { configureStore } from "@reduxjs/toolkit";
import nftReducer from "@/reducer/nftSlice";
import feeReducer from "@/reducer/feeSlice";
import userReducer from "@/reducer/userSlice";
import RoleByUserReducer from "@/reducer/RoleByUserSlice";
import BuySliceReducer from "@/reducer/BuySlice";

export const store = configureStore({
  reducer: {
    nft: nftReducer,
    fee:feeReducer,
    userInfo:userReducer,
    roleByUser:RoleByUserReducer,
    buyOrBid:BuySliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
