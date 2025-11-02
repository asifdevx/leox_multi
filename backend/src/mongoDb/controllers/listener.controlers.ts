import { Bid, Fee, NFT } from '../schemas/marketplace.schema';
import { createEthContract } from '../../config/bsc.service';
import { io } from '../../index';
import { newBuyer, syncSingleNFT, unListedNFT } from './nft.controlers';
import { findNFT } from './userInfo.controlers';
import {
  bids,
  changeHigestBiderInfo,
  handleAuctionClaimed,
  handleBidRefunded,
} from './AuctionBid.controlers';
import { ethers } from 'ethers';

export async function startNFTListener() {
  const contract = await createEthContract();

  contract.on('TokenListed', async (tokenId, seller, price, event) => {
    try {
      console.log(`🎨 New NFT Listed! Token ID: ${tokenId}, Seller: ${seller}, Price: ${price}`);
      const transformedNFT = await syncSingleNFT({
        tokenId: tokenId.toString(),
        address: seller,
      });
      io.emit('newNFTListed', transformedNFT);
    } catch (error) {
      console.error('❌ Error syncing new NFT:', error);
    }
  });
  contract.on('TokenUnlisted', async (tokenId, seller,event) => {
    try {
      console.log(`🎨 nft unListed: ${tokenId}, Seller: ${seller}`);
      const tranformedNft = await unListedNFT({tokenId:tokenId.toString(),seller});
      io.emit("unListed",{
        tokenId:tranformedNft.tokenId,
        seller:tranformedNft.seller,
        isListed:tranformedNft.isListed,
        
      })
    } catch (error) {
      console.error('❌ Error syncing new NFT:', error);
    }
  });
  contract.on('AuctionStarted', async (tokenId, minPrice, endTime, event) => {
    try {
      const seller = (await event.log.getTransaction()).from.toLowerCase();
      console.log(`🎨 New NFT Listed! Token ID: ${tokenId}, Seller: ${seller}, Price: ${minPrice}`);
      const transformedNFT = await syncSingleNFT({
        tokenId: tokenId.toString(),
        address: seller,
      });
      io.emit('newNFTListed', transformedNFT);
    } catch (error) {
      console.error('❌ Error syncing new NFT:', error);
    }
  });
  //  update fee listen

  contract.on('UpdateFee', async (newFee, timestamp, event) => {
    try {
      const savedFee = await Fee.create({
        fee: Number(newFee) / 10,
        updateAt: new Date(Number(timestamp) * 1000),
        txHash: event.transactionHash,
      });
      io.emit('updateFee', savedFee.toObject());
      console.log('✅ Fee updated:', savedFee);
    } catch (error) {
      console.warn('Failed to update fee in MongoDB:', error.message);
    }
  });

  //update Bid

  contract.on('NewBid', async (tokenId, seller, bidder, bid, event) => {
    try {
      await bids({
        tokenId: tokenId.toString(),
        seller,
        bidder,
        claim: false,
        totalBid: parseFloat(ethers.formatEther(bid)),
        txHash: event.transactionHash,
      });
      await changeHigestBiderInfo(tokenId, seller, bid, bidder);

      const updatedBidDoc = await Bid.findOne({
        tokenId: tokenId.toString(),
        seller: seller.toLowerCase(),
      }).lean();

      io.emit('NewBid', {
        tokenId: tokenId.toString(),
        seller: seller.toLowerCase(),
        bids: updatedBidDoc?.bids || [],
      });
      console.log(
        `💰 New/Updated bid for Token ${tokenId}: ${bidder} bid ${ethers.formatEther(bid)}`,
      );
    } catch (error) {
      console.warn('Failed to update bid :', error.message);
    }
  });

  // Buy Nft

  contract.on('TokenBought', async (tokenId, buyer, seller, quantity, totalPrice, event) => {
    try {
      const nft = await findNFT({ tokenId, seller });
      if (!nft) {
        console.warn(`⚠️ NFT not found for tokenId: ${tokenId}, seller: ${seller}`);
        return; // exit early so you don't try to access null
      }
      const tokenStr = tokenId.toString();
      const newRemaining = nft.remainingSupply - Number(quantity);
//update nft data 
      const update = {
        $set: {
          remainingSupply: newRemaining,
          updatedAt: new Date(),
          isListed: true,
        },
      };

      if (newRemaining <= 0) {
        update.$set.isListed = false;
      }

      const updatedNFT = await NFT.findOneAndUpdate(
        { tokenId: tokenStr, seller: seller.toLowerCase() },
        update,
        { new: true },
      );
      const buyerNFT = await newBuyer({ tokenId, buyer, seller, quantity });

      io.emit('TokenBought', {
        tokenId: tokenStr,
        buyer: buyer.toLowerCase(),
        seller: seller.toLowerCase(),
        quantity: quantity.toString(),
        totalPrice: totalPrice.toString(),
        remainingSupply: newRemaining,
        isListed : updatedNFT.isListed,
        buyerNFT,
      });
      console.log('updatedNFT', updatedNFT);
    } catch (error) {
      console.error('❌ Error handling TokenBought:', error);
    }
  });

  contract.on('AuctionClaimed', async (tokenId, seller, winner, amount, event) => {
    const caller = (await event.getTransaction()).from.toLowerCase();

    await handleAuctionClaimed(tokenId, seller, winner, caller, io);
  });

  contract.on('BidRefunded', async (tokenId, seller, bidder) => {
    await handleBidRefunded(tokenId, seller, bidder, io);
  });
}
