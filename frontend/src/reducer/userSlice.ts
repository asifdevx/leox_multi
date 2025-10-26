import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import * as type from "@/types";
import { GET_USER_INFO, UPDATE_USER_INFO } from "@/config/graphql";
import { fetchGraphQL } from "@/api/graphql";




export const getUserInfo = createAsyncThunk(
  "user/getUserInfo",
  async (
    { address }: {  address: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await fetchGraphQL<{ getUserInfo: type.UserInfoType }>(
        GET_USER_INFO,
        {  address }
      );
      console.log("user", data?.getUserInfo);

      return data?.getUserInfo;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch user data");
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  "user/updateInfo",
  async ({ address, name, gmail, roles }: type.UserInfoType, { rejectWithValue }) => {
    try {
      const data = await fetchGraphQL<{
        updateUserInfo: type.UserInfoType;
      }>(UPDATE_USER_INFO, { name, gmail, address, roles});
     

      return data?.updateUserInfo;
    } catch (error:any) {
      return rejectWithValue(error?.message || "Failed to update user data");
    }
  }
);

const initialState: type.UserInfoType & {
  
  loading: boolean;
  fetched: boolean;
  error: string | null;
} = {
  
  address: "",
  name:"",
  gmail: null,
  roles: [],
  isFirstTime: true,
  follower:0,
  following:0,
  loading: false,
  fetched: false,
  error: null,
};

const userSlice= createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    clearRole(state) {
      state.name = "";
      state.gmail = null;
      state.address = "";
      state.roles = [];
      state.isFirstTime=true;
      state.error = null;
      state.fetched = false;
      state.loading = false;
    },
    setAddress(state, action) {
      if (state.address !== action.payload) {
        state.address = action.payload;
        
        state.fetched = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserInfo.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.fetched = true;
        state.error = null;
        state.isFirstTime=payload?.isFirstTime ?? true; 
        state.gmail = payload?.gmail ;
        state.follower=payload?.follower as number;
        state.following=payload?.following as number;
        state.name = payload?.name as string;
        state.roles = payload?.roles as type.Role[];
        state.address = payload?.address as string;
      })
      .addCase(getUserInfo.rejected, (state) => {
        state.loading = false;
        state.error = "failed to get user data";
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.fetched = true;
        state.error = null;
        if (payload) {
         
          state.isFirstTime=payload?.isFirstTime ; 
          state.follower=payload?.follower ?? state.follower;
          state.following=payload?.following ?? state.following;
          state.name = payload.name ?? state.name;
          state.gmail = payload.gmail ?? state.gmail;
          state.address = payload.address ?? state.address;
          state.roles = payload?.roles ?? state.roles ;
        }
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

  },
});

export const { clearRole, setAddress } = userSlice.actions;
export default userSlice.reducer;
