import { AppDispatch } from '@/components/store/store';
import { addBidEvent, updateBidder } from '@/reducer/BuySlice';
import { fatchFee } from '@/reducer/feeSlice';
import { addNewNFT, updateAuctionEnd, updateBidInfo, updateListing } from '@/reducer/nftSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';


// const socket = io(`wss://leox-backend.onrender.com`, {
const socket = io(`http://192.168.1.100:8000`, {
  withCredentials: true,
  transports: ['websocket'],
});


export default function SocketListener() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    socket.on('updateFee', (newFee) => {
      dispatch(fatchFee(newFee));
    });
    socket.on('newNFTListed', (nft) => {
      dispatch(addNewNFT(nft));
    });
    socket.on('NewBid', (data) => {
      if (!data?.tokenId || !data?.seller) return;

      const tokenId = data.tokenId.toString();
      const seller = data.seller.toLowerCase();

      const bids = Array.isArray(data.bids)
        ? data.bids.map((b: any) => ({
            bidder: b.bidder,
            bid: b.bid || b.totalBid,
            claim:b.claim,
            createdAt: b.createdAt || new Date().toISOString(),
          }))
        : [];
      dispatch(addBidEvent({ tokenId, seller, bids }));
          
      if (bids.length > 0) {
        const sorted = [...bids].sort((a, b) => parseFloat(b.bid) - parseFloat(a.bid));
        const { bidder, bid } = sorted[0];
        dispatch(updateBidInfo({ tokenId, seller, highestBid: bid, highestBider: bidder }));
      }
    });

    socket.on('TokenBought', (data) => {
      dispatch(updateListing(data));
      if (data.buyerNFT) dispatch(addNewNFT(data.buyerNFT));
    });

    socket.on('AuctionClaimed', ({tokenId,seller,caller,highestBidder,buyerNFT}) => {
      if(!tokenId || !seller || !caller || !highestBidder) return;
      if(caller == highestBidder || caller==seller){
        dispatch(updateAuctionEnd({tokenId,seller,claim:true}))
        dispatch(addNewNFT(buyerNFT))
      }
      dispatch(updateBidder({tokenId,seller,bidder:caller,claim:true}));
      
    });  
      socket.on('BidRefunded', (data) => {
      if(!data.tokenId || !data.seller || !data.caller ) return;
      
      dispatch(updateBidder({tokenId:data.tokenId,seller:data.seller,bidder:data.caller,claim:true}));
      
    });
 

    return () => {
      socket.off('updateFee');
      socket.off('newNFTListed');
      socket.off('NewBid');
      socket.off('TokenBought');
      socket.off('AuctionClaimed');
      socket.off('BidRefunded');
    };
  }, [dispatch]);
  return null;
}
