
import { getUserByRole } from "@/api/api";
import { UsersState } from "@/types";
import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const fetchUsersByRole = createAsyncThunk("users/fetchByRole" , async (role:string,{rejectWithValue})=>{
    try {
        const data = await getUserByRole(role);
       
        return {role,data} ;
    } catch (error:any) {
       return rejectWithValue(error.message || "Failed to fetch users") 
    }
})

const initialState:UsersState  = {
    usersByRole: {},
    loading: false,
    error: null,
   
};

const roleByUserSlice = createSlice({
  name: "userByRole",
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsersByRole.pending,(state)=>{
        state.loading=true;
        state.error=null;
    }).addCase(fetchUsersByRole.fulfilled,(state,action)=>{
        const {role,data} = action.payload;
        state.usersByRole[role]=data;
        state.loading=false;
        state.error=null;
    }).addCase(fetchUsersByRole.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload as string;
    })

  },
});

export const {  } = roleByUserSlice.actions;
export default roleByUserSlice.reducer;
