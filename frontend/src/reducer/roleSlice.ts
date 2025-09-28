import { getFee } from "@/api/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createEthContract } from "./nftSlice";
import { Role, UserRole } from "@/types";
import { ADD_USER_ROLE, GET_USER_ROLE, REMOVE_USER_ROLE } from "@/config/graphql";
import { fetchGraphQL } from "@/api/graphql";

export const getUserRole = createAsyncThunk(
  "role/getRole",
  async (address: string, { rejectWithValue }) => {
    try {
      
      const data = await fetchGraphQL<{getUserRole:UserRole}>(GET_USER_ROLE, { address });
      console.log("data",data);
      
      return data?.getUserRole?.roles ?? [];
    } catch (error: any) {
    
      return rejectWithValue(error?.message || "Failed to fetch user role");
    }
  }
);
export const addUserRole = createAsyncThunk(
  "role/addRole",
  async ({address,role}:{address:string,role:Role}, { rejectWithValue }) => {
    try {
      const data = await fetchGraphQL<{addUserRole:UserRole}>(ADD_USER_ROLE, { address,role });
      return data?.addUserRole?.roles ?? [];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch user role");
    }
  }
);

export const removeUserRole = createAsyncThunk(
  "role/removeRole",

  async ({address,role}:{address:string,role:Role}, { rejectWithValue }) => {
    try {
      const data = await fetchGraphQL<{removeUserRole:UserRole}>(REMOVE_USER_ROLE, { address,role });
      return data?.removeUserRole?.roles ?? [];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch user role");
    }
  }
);
const initialState: UserRole & { loading: boolean; error:string | null } = {
  address: null,
  roles: [],
  loading: false,
  error: null,
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    clearRole(state) {
      state.address = null;
      state.roles = [];
      state.error = null;
      state.loading = false;
    },
    setAddress(state,action) {
      state.address=action.payload
    }
  },
  extraReducers: (builder) => {
    builder.
    addCase(getUserRole.pending,(state)=>{
      state.loading = true;
      state.error = null;

    })
    .addCase(getUserRole.fulfilled, (state, action) => {
      state.loading = false;
      state.roles = action.payload ?? state.roles ;
    })
    .addCase(getUserRole.rejected, (state, action) => {
      state.loading = false;
      state.error = `${action.payload || "Error fetching roles"}`;
      state.roles = ["Buyer"]; 
    });
    builder.
    addCase(addUserRole.pending,(state)=>{
      state.loading = true;
      state.error = null;

    })
    .addCase(addUserRole.fulfilled, (state, action) => {
      state.loading = false;
      state.roles = action.payload as Role[];
    })
    .addCase(addUserRole.rejected, (state, action) => {
      state.loading = false;
      state.error = `${action.payload || "Error fetching roles"}`;
    });

    builder
    .addCase(removeUserRole.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(removeUserRole.fulfilled, (state, action) => {
      state.loading = false;
      state.roles = action.payload as Role[];
    })
    .addCase(removeUserRole.rejected, (state, action) => {
      state.loading = false;
      state.error = typeof action.payload === "string" ? action.payload : "Error removing role";
    });
  },
});

export const {clearRole,setAddress} = roleSlice.actions;
export default roleSlice.reducer;
