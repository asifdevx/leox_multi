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
  async ({ address, name, gmail, role, action }: type.updateUserInfoType, { rejectWithValue }) => {
    try {
      const data = await fetchGraphQL<{
        updateUserInfo: type.UserInfoType;
      }>(UPDATE_USER_INFO, { name, gmail, address, role, action });
      console.log("roles", data?.updateUserInfo);

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
  gmail: "",
  roles: [],
  loading: false,
  fetched: false,
  error: null,
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    clearRole(state) {
      state.name = "";
      state.gmail = null;
      state.address = "";
      state.roles = [];
      state.error = null;
      state.fetched = false;
      state.loading = false;
    },
    setAddress(state, action) {
      if (state.address !== action.payload) {
        state.address = action.payload;
        state.roles = [];
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
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.fetched = true;
        state.error = null;
        state.gmail = action.payload?.gmail ;
        state.name = action.payload?.name as string;
        state.roles = action.payload?.roles as type.Role[];
        state.address = action.payload?.address as string;
      })
      .addCase(getUserInfo.rejected, (state) => {
        state.loading = false;
        state.error = "failed to get user data";
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.fetched = true;
        state.error = null;
        if (action.payload) {
          state.name = action.payload.name ?? state.name;
          state.gmail = action.payload.gmail ?? state.gmail;
          state.address = action.payload.address ?? state.address;
          state.roles = action.payload?.roles ?? state.roles ;
        }
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRole, setAddress } = roleSlice.actions;
export default roleSlice.reducer;
