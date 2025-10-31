import { NFT } from '@/types'
import React from 'react'

const HigestBidOrNot = (nft:NFT) => {
    const isAuction = nft.saleType !==0 ?true:false ;
    if(isAuction){
        return {
            "Higest Bid":nft.highestBid
        }
    }else{
        return {
            "Price":nft.price
        }
    }


}

export default HigestBidOrNot