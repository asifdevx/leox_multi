import { Fee, NFT } from "../schemas/nft.schema";
import { createEthContract } from "../../config/bsc.service";
import { fetchMetadata } from "../../config/ipfs.service";
import { ethers } from "ethers";

export const getNFTs = async (start = 0, limit: number) => {
  const contract = await createEthContract();
  const nftsRaw = await contract.getPaginatedListed(start, limit);

  const result = await Promise.all(
    nftsRaw.map(async (nft: any) => {
      const tokenId = nft[0].toString();

      let tokenURI = "";
      try {
        tokenURI = await contract.uri(tokenId);
      } catch (err) {
        console.warn("Failed to get tokenURI for token:", tokenId, err.message);
      }
      const meta = await fetchMetadata(tokenURI);

      const transformed = {
        tokenId,
        seller: nft[2],
        owner: nft[1],
        name: meta?.name || `Token #${tokenId}`,
        description: meta?.description || "",
        image: meta?.image || "",
        price: ethers.formatEther(nft[3]),
        supply: nft[4].toString(),
        remainingSupply: Number(nft[5]),
        isListed: nft[6],
        saleType: Number(nft[7]),
        auctionEndTime: Number(nft[8]),
        highestBidder: nft[9],
        highestBid: ethers.formatEther(nft[10]),
        claimed: nft[11],
        tokenURI,
        updatedAt: new Date(),
      };

      try {
        await NFT.updateOne(
          { tokenId: transformed.tokenId, seller: transformed.seller },
          { $set: transformed },
          { upsert: true }
        );
      } catch (err) {
        console.warn("MongoDB upsert failed", err.message);
      }
      return transformed;
    })
  );
  return result;
};
// --------------------------------findfee -------------------------------------
export const findFee = async () => {

  const latestFee = await Fee.findOne().sort({ updateAt: -1 }).lean();
  console.log(latestFee,"latestFee");
  
  if (!latestFee) {
    
    const contract = await createEthContract();
    const feeBigNumber = await contract.marketplaceFee();
    const fee= Number(feeBigNumber) / 10;
   
    const newFee = await Fee.create({
      fee: Number(fee),
      updateAt: new Date(),
      txHash: null, 
    });

    return newFee.toObject();
  }

 
  return latestFee;
};

// --------------------------------UPDatefee -------------------------------------
export const updateFee = async (fee: number) => {
  const contract = await createEthContract();
  const tx = await contract.updateMarketplaceFee(fee);
  const receipt = await tx.wait();

  try {
    await Fee.create({
      fee,
      updateAt: new Date(),
      txhase: receipt.transactionHash,
    });
  } catch (error) {
    console.warn("failed to fatch fee", error.message);
  }
  return receipt.transactionHash;
};
