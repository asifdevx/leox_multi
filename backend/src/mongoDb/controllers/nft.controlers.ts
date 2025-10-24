import { NFT } from '../schemas/marketplace.schema';
import { createEthContract } from '../../config/bsc.service';
import { fetchMetadata } from '../../config/ipfs.service';
import { ethers } from 'ethers';
import { findNFT} from './userInfo.controlers';
import {findNameByNftAddress} from "../../utils";

type sortByProps = 'highestPrice' | 'lowestPrice' | 'recent' | 'oldest';

export const syncSingleNFT = async ({ tokenId, address }: { tokenId: string; address: string }) => {
  const contract = await createEthContract();

  try {
    const nft = await contract.Listings(tokenId, address);
    const tokenURI = await contract.uri(tokenId);
    const meta = await fetchMetadata(tokenURI);

   const username = await findNameByNftAddress(nft[2]);

    const transformedNFT = {
      tokenId,
      owner: nft[1],
      seller: nft[2],
      username,
      name: meta.name || `Token #${tokenId}`,
      description: meta.description || '',
      image: meta.image || '',
      price: parseFloat(ethers.formatEther(nft[3])),
      supply: nft[4].toString(),
      remainingSupply: Number(nft[5]),
      isListed: nft[6],
      saleType: Number(nft[7]),
      auctionStartTime: Math.floor(Number(nft[8]) - (Number(nft[8]) - Date.now() / 1000)),
      auctionEndTime: Math.floor(Number(nft[8])),
      highestBidder: nft[9],
      highestBid: parseFloat(ethers.formatEther(nft[10])),
      claimed: nft[11],
      tokenURI,
      updatedAt: new Date(),
    };

    await NFT.updateOne(
      { tokenId: transformedNFT.tokenId, seller: transformedNFT.seller },
      { $set: transformedNFT },
      { upsert: true },
    );

    return transformedNFT;
  } catch (error) {
    console.error(`❌ Failed to sync NFT ${tokenId}:`, error);
  }
};

interface NewBuyerProps {
  tokenId: string;
  buyer: string;
  seller: string;
  quantity: number;
}

export const newBuyer = async ({ tokenId, buyer, seller, quantity }: NewBuyerProps) => {
  const contract = await createEthContract();
  const balanceOfBuyer = await contract.balanceOf(buyer, Number(tokenId));

  const lowerBuyer = buyer.toLowerCase();
  const tokenStr = tokenId.toString();

  const { owner, name, description, image, tokenURI } = await findNFT({
    tokenId: tokenStr,
    seller: seller.toLowerCase(),
  });
  const buyerNft = await findNFT({ tokenId: tokenStr, seller: buyer });
  const username = await findNameByNftAddress(lowerBuyer)
  let resultNFT;

  if (!buyerNft) {
    const newBuyerNFT = {
      tokenId: tokenStr,
      owner: owner,
      seller: lowerBuyer,
      username,
      name,
      description,
      image,
      price: '0',
      supply: quantity,
      remainingSupply: Number(balanceOfBuyer),
      isListed: false,
      saleType: 0,
      auctionStartTime: 0,
      auctionEndTime: 0,
      highestBidder: '0x0000000000000000000000000000000000000000',
      highestBid: 0,
      claimed: false,
      tokenURI,
      updatedAt: new Date(),
    };
    resultNFT = await NFT.create(newBuyerNFT);
    console.log(`🟢 Created buyer record for ${buyer} (tokenId: ${tokenStr})`);
  } else {
    const newSupply = Number(buyerNft.remainingSupply || 0) + quantity;
    buyerNft.remainingSupply = newSupply;
    buyerNft.updatedAt = new Date();
    resultNFT = await buyerNft.save()
    console.log(`🟢 Updated buyer record for ${buyer} (tokenId: ${tokenStr})`);
  }
  return resultNFT.toObject ? resultNFT.toObject() : resultNFT;
};

export const getNFTs = async (start: number, limit: number, sortBy: sortByProps) => {
  const sortOptions: Record<string, -1 | 1> = {};

  switch (sortBy) {
    case 'highestPrice':
      sortOptions.price = -1;
      break;
    case 'lowestPrice':
      sortOptions.price = 1;
      break;
    case 'recent':
    default:
      sortOptions.updatedAt = -1;
      break;
    case 'oldest':
      sortOptions.updatedAt = 1;
      break;
  }

  const nfts = await NFT.find({}).sort(sortOptions).skip(start).limit(limit).lean().exec();

  const normalized = nfts.map((n: any) => ({
    ...n,
    updatedAt:
      n.updatedAt instanceof Date ? n.updatedAt.toISOString() : new Date(n.updatedAt).toISOString(),
  }));

  return normalized;
};
