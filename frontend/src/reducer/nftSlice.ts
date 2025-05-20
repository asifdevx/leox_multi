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
export const fetchNFT = createAsyncThunk("nft/fetchNFT", async () => {
  const contract = await createEthContract();
  const nftsRaw = await contract?.getAllListed();

  if (!nftsRaw) return [];

  const nftsArray = Array.from(nftsRaw);
  console.log("nftsArray Data:", nftsArray);

  const tokens = await Promise.all(
    nftsArray.map(async (nft: any) => {
      const tokenId = nft[0].toString();
      let metadata = { name: "", description: "", image: "" };

      try {
        const tokenURI = await contract?.tokenURI(tokenId);

        if (tokenURI) {
          const ipfsHash = tokenURI.replace("ipfs://", "");
          const metaRes = await axios.get(`https://ipfs.io/ipfs/${ipfsHash}`);
          metadata = metaRes.data;
          
        }
      } catch (error) {
        console.error(`Error fetching metadata for token ${tokenId}:`, error);
      }

      const imageURL = metadata.image
        ? `https://ipfs.io/ipfs/${metadata.image.replace("ipfs://", "")}`
        : "https://ipfs.io/ipfs/QmV3TTBR8ZGSxWx4c9wTCybozP5nknpk3m3jDkPzcnhXhZ";

      return {
        tokenId,
        name: metadata.name || `Token #${tokenId}`,
        description: metadata.description || "No description available",
        image: imageURL,
        price: ethers.formatEther(nft[3]),
        owner: nft[1],
        seller: nft[2],
        isSold: nft[4],
      };
    })
  );

  return tokens;
});

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
