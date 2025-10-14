import { Fee } from "../schemas/marketplace.schema";
import { createEthContract } from "../../config/bsc.service";
import { io } from "../../index";
import { syncSingleNFT } from "./nft.controlers";

export async function startNFTListener() {
  const contract = await createEthContract();

 contract.on("TokenListed",async (tokenId,seller, price, event)=>{
  try {
    console.log(`🎨 New NFT Listed! Token ID: ${tokenId}, Seller: ${seller}, Price: ${price}`);
    const transformedNFT = await syncSingleNFT({tokenId:tokenId.toString(), address:seller});
    io.emit("newNFTListed",transformedNFT); 
  } catch (error) {
    console.error("❌ Error syncing new NFT:", error);
  }
 })
 
 
 
//  update fee listen 
 
  contract.on("UpdateFee", async (newFee, timestamp, event) => {
    try {
      const savedFee = await Fee.create({
        fee:Number(newFee) / 10,
        updateAt:new Date(Number(timestamp) * 1000),
        txHash: event.transactionHash,
      });
      io.emit ("updateFee",savedFee.toObject());
      console.log("✅ Fee updated:", savedFee);
    } catch (error) {
      console.warn("Failed to update fee in MongoDB:", error.message);
    }
  });
}


