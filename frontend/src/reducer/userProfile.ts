import { fetchGraphQL } from "@/api/graphql";
import { GET_USER_PROFILE } from "@/config/graphql";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import * as type from "@/types";

export const getUserProfile = createAsyncThunk(
    "user/getUserProfile",
    async (
      { name }: {  name: string },
      { getState,rejectWithValue }
    ) => {
    const state = getState() as { userProfile:type.UserProfileState}
      
    if (state.userProfile.cache[name]){
      console.log("⚡ Using cached profile:", name);
      return { cached: true, profile: state.userProfile.cache[name] };
    }
      try {
        const data = await fetchGraphQL<{ userProfile: type.ProfileData }>(
          GET_USER_PROFILE,
          {  name }
        );
        if (!data || data.userProfile === null) {
          // Instead of throwing, return null profile
          return { cached: false, profile: null }
        }
        return { cached: false, profile: data.userProfile };
  
      } catch (error: any) {
        return rejectWithValue(error?.message || "Failed to fetch user Profile");
      }
    }
  );
  

const initialState:type.UserProfileState ={
    cache:{},
    current:null,
    loading:false,
    error:null

}

const userProfileSlice= createSlice({
    name: "userInfo",
    initialState,
    reducers: {
      clearProfile (state){
        state.current = null;
        state.error = null;
      }
    },
    extraReducers:(builder)=>{
      builder
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.current = payload.profile;
        
        if (!payload.cached && payload.profile) {
          state.cache[payload.profile.user.name.toLowerCase()] = payload.profile;
        }
      })
      .addCase(getUserProfile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });
    }
    
})


export const { clearProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;