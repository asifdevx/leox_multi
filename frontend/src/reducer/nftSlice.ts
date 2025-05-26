import axios from "axios";
import dotenv from "dotenv";
import * as ethers from "ethers";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import abi from "@/components/ABI/abi.json";
import { CreateNFTArgs, NftState } from "@/types";

dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTACT_ADDRESS;

const createEthContract = async () => {
  if (!window.ethereum) {
    console.error("MetaMask not detected.");
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS!, abi, signer);
};

export const createNFT = createAsyncThunk(
  "nft/createNFT",
  async ({ tokenURI, supply, price }: CreateNFTArgs) => {
    try {
      const contract = await createEthContract();
      const tx = await contract?.mint(
        tokenURI,
        supply,
        ethers.parseEther(price.toString())
      );
      if (!tx) throw new Error("Transaction failed to initialize.");
      await tx.wait();
      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error("Error creating NFT:", error);
      throw error;
    }
  }
);

export const fetchNFT = createAsyncThunk(
  "nft/fetchNFT",
  async ({ start, limit }: { start: number; limit: number }, thunkAPI) => {
    const contract = await createEthContract();
    const nftsRaw = await contract?.getPaginatedListed(start, limit);
    if (!nftsRaw) return [];

    const tokens = await Promise.all(
      Array.from(nftsRaw).map(async (nft: any) => {
        const tokenId = nft[0].toString();
        let metadata = { name: "", description: "", image: "" };

        try {
          const tokenURI = await contract?.uri(tokenId);
          const ipfsCID = tokenURI.replace("ipfs://", "");
          const metaRes = await axios.get(
            `https://nftstorage.link/ipfs/${ipfsCID}`
          );

          metadata = metaRes.data;
        } catch (error) {
          console.error(`Error fetching metadata for token ${tokenId}:`, error);
        }
        const imageUrl = metadata.image?.startsWith("ipfs://")
          ? `https://nftstorage.link/ipfs/${metadata.image.replace(
              "ipfs://",
              ""
            )}`
          : metadata.image || "";
        console.log("nft", nft);

        return {
          tokenId: Number(tokenId),
          name: `${metadata.name} ${tokenId}` || `Token #${tokenId}`,
          description: metadata.description || "No description available",
          image: imageUrl,
          creator: nft[1],
          seller: nft[2],
          price: ethers.formatEther(nft[3]),
          supply: nft[4].toString(),
          remainingSupply: Number(nft[5]),
          isListed: nft[6],
          saleType: Number(nft[7]),
          auctionEndTime: Number(nft[8]),
          highestBidder: nft[9],
          highestBid: ethers.formatEther(nft[10]),
          claimed: nft[11],
        };
      })
    );

    return tokens;
  }
);
export const getMarketplaceFee = createAsyncThunk("nft/fee", async () => {
  const contract = await createEthContract();
  try {
    const feeBigNumber = await contract?.marketplaceFee();
    return Number(feeBigNumber) / 10;
  } catch (error) {
    console.log("couldn't find fee", error);
  }
});

const initialState: NftState = {
  listings: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 0,
  limit: 2,
  fee: 0,
};

const nftSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNFT.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNFT.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createNFT.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchNFT.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNFT.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.length < state.limit) {
          state.hasMore = false;
        }

        // Use "tokenId-seller" as the unique key
        const existingKeys = new Set(
          state.listings.map((item) => `${item.tokenId}-${item.seller}`)
        );

        const newUniqueListings = action.payload.filter(
          (item) => !existingKeys.has(`${item.tokenId}-${item.seller}`)
        );

        state.listings.push(...newUniqueListings);
        state.page += newUniqueListings.length;
      })
      .addCase(fetchNFT.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch listings";
      })
      .addCase(getMarketplaceFee.fulfilled, (state, action) => {
        state.fee = action.payload;
      })
      .addCase(getMarketplaceFee.rejected, (state) => {
        state.fee = 1;
      });
  },
});

export default nftSlice.reducer;
