import axios from "axios";
import dotenv from "dotenv";
import * as ethers from "ethers";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import abi from "@/components/ABI/abi.json";
import { CreateNFTArgs } from "@/types";

dotenv.config();
const CONTRACT_ADDRESS = "0x418827B40996Fae761cFF40fB95D7042f9404cfe";

const createEthContract = async () => {
  if (!window.ethereum) {
    console.error("MetaMask not detected.");
    return;
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS!, abi, signer);
  return contract;
};

export const createNFT = createAsyncThunk(
  "nft/createNFT",
  async (
    {
      tokenURI,
      supply,
      price,
    }:CreateNFTArgs
  ) => {
    try {
      const contract =await createEthContract();
      const tx= await contract?.mint(tokenURI,supply,ethers.parseEther(price.toString()));
      if (!tx) {
        throw new Error("Transaction failed to initialize.");
      }
      await tx.wait();
      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error("Error creating NFT:", error);
    }
  }
);

const initialState = {
  nfts:[],
  loading: false,
};

const nftSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(createNFT.pending,(state)=>{
      loading:true
    })
    .addCase(createNFT.fulfilled,(state)=>{
      loading:false
    })
  },
});

export default nftSlice.reducer;
