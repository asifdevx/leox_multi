import { NFT } from "../schemas/marketplace.schema";
import { createEthContract } from "../../config/bsc.service";

import { fetchMetadata } from "../../config/ipfs.service";
import { ethers } from "ethers";
type sortByProps = "highestPrice" | "lowestPrice" | "recent" | "oldest";

export const syncSingleNFT = async ({
  tokenId,
  address,
}: {
  tokenId: string;
  address: string;
}) => {
  const contract = await createEthContract();

  try {
    const nft = await contract.Listings(tokenId, address);
    const tokenURI = await contract.uri(tokenId);
    const meta = await fetchMetadata(tokenURI);

    const transformedNFT = {
      tokenId,
      seller: nft[2],
      owner: nft[1],
      name: meta.name || `Token #${tokenId}`,
      description: meta.description || "",
      image: meta.image || "",
      price: parseFloat(ethers.formatEther(nft[3])),
      supply: nft[4].toString(),
      remainingSupply: Number(nft[5]),
      isListed: nft[6],
      saleType: Number(nft[7]),
      auctionEndTime: Number(nft[8]),
      highestBidder: nft[9],
      highestBid: parseFloat(ethers.formatEther(nft[10])),
      claimed: nft[11],
      tokenURI,
      updatedAt: new Date(),
    };

    await NFT.updateOne(
      { tokenId: transformedNFT.tokenId, seller: transformedNFT.seller },
      { $set: transformedNFT },
      { upsert: true }
    );
   
    return transformedNFT;
  } catch (error) {
    console.error(`❌ Failed to sync NFT ${tokenId}:`, error);
  }
};

export const getNFTs = async (
  start: number,
  limit: number,
  sortBy: sortByProps
) => {
  const sortOptions: Record<string, -1 | 1> = {};

  switch (sortBy) {
    case "highestPrice":
      sortOptions.price = -1;
      break;
    case "lowestPrice":
      sortOptions.price = 1;
      break;
    case "recent":
    default:
      sortOptions.updatedAt = -1;
      break;
    case "oldest":
      sortOptions.updatedAt = 1;
      break;
  }

  const nfts = await NFT.find({})
    .sort(sortOptions)
    .skip(start)
    .limit(limit)
    .lean()
    .exec();


  const normalized = nfts.map((n: any) => ({
    ...n,
    updatedAt:
      n.updatedAt instanceof Date
        ? n.updatedAt.toISOString()
        : new Date(n.updatedAt).toISOString(),
  }));
  console.log("normalized");
  
  return normalized;
};
