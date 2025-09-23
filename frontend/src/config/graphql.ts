export const getNft = `
query GetNFTs($start:Int!,$limit:Int!) {
  nfts(start:$start,limit:$limit) {
    tokenId
    name
    description
    image
    seller
    owner
    price
    supply
    remainingSupply
    isListed
    saleType
    auctionEndTime
    highestBidder
    highestBid
    claimed
  }
}
`;