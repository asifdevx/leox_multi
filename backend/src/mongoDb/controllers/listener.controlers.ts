import { Bid, Fee, NFT } from '../schemas/marketplace.schema';
import { createEthContract } from '../../config/bsc.service';
import { io } from '../../index';
import { newBuyer, syncSingleNFT } from './nft.controlers';
import { findNFT } from './userInfo.controlers';
import { bids, changeHigestBiderInfo, handleAuctionClaimed } from './AuctionBid.controlers';
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
      const Nft = await findNFT({ tokenId, seller });
      if (!Nft) {
        console.warn(`⚠️ NFT not found for tokenId: ${tokenId}, seller: ${seller}`);
        return; // exit early so you don't try to access null
      }
      const tokenStr = tokenId.toString();
      const newRemaining = Nft.remainingSupply - Number(quantity);
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
      io.emit('TokenBought', {
        tokenId: tokenStr,
        buyer: buyer.toLowerCase(),
        seller: seller.toLowerCase(),
        quantity: quantity.toString(),
        totalPrice: totalPrice.toString(),
        remainingSupply: newRemaining,
      });
      console.log('updatedNFT', updatedNFT);

      await newBuyer({ tokenId, buyer, seller, quantity });
    } catch (error) {
      console.error('❌ Error handling TokenBought:', error);
    }
  });

  contract.on(
    'AuctionClaimed',
    async (tokenId, seller, highestBidder, highestBid, event) => {
      await handleAuctionClaimed(tokenId, seller, highestBidder, event);
    },
  );
  
  
}
