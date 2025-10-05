import {  NFT } from "../schemas/marketplace.schema";
import { createEthContract } from "../../config/bsc.service";


import { fetchMetadata } from "../../config/ipfs.service";
import { ethers } from "ethers";

export const getNFTs = async (start = 0, limit: number) => {
  const contract = await createEthContract();
  const nftsRaw = await contract.getPaginatedListed(start, limit);
  const pMap = (await import("p-map")).default;
  const transformed = await pMap(
    nftsRaw,
    async (nft: any) => {
      const tokenId = nft[0].toString();

      let tokenURI = "";
      try {
        tokenURI = await contract.uri(tokenId);
      } catch (err) {
        console.warn("Failed to get tokenURI for token:", tokenId, err.message);
      }

      const meta = await fetchMetadata(tokenURI);

      const transformedNFT = {
        tokenId,
        seller: nft[2],
        owner: nft[1],
        name: meta.name || `Token #${tokenId}`,
        description: meta.description || "",
        image: meta.image || "",
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
        // Only update DB if NFT is new or metadata changed
        await NFT.updateOne(
          { tokenId: transformedNFT.tokenId, seller: transformedNFT.seller },
          { $set: transformedNFT },
          { upsert: true }
        );
      } catch (err) {
        console.warn("MongoDB upsert failed for token:", tokenId, err.message);
      }

      return transformedNFT;
    },
    { concurrency: 10 } 
  );

  return transformed;
};
