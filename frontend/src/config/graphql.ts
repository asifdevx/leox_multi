export const GET_NFT = `
query GetNFTs($start:Int!,$limit:Int!,$sortBy: String) {
  nfts(start:$start,limit:$limit,sortBy: $sortBy) {
    tokenId
    name
    username
    description
    image
    seller
    owner
    price
    supply
    remainingSupply
    isListed
    saleType
    auctionStartTime
    auctionEndTime
    highestBidder
    highestBid
    claimed
    updatedAt
  }
}
`;

export const GET_USER_INFO = `
query GetUserData($address:String!){
  getUserInfo(address:$address){
    name
    gmail
    address
    roles
    isFirstTime
  }
}
`;

export const UPDATE_USER_INFO = `
mutation addRole($name:String,$gmail:String,$address:String!,$roles:[String]){
  updateInfo(name:$name,gmail:$gmail,address:$address,roles:$roles){
    name
    gmail
    address
    roles
    isFirstTime
  }
}
`;

export const GET_BID_HISTORY = `
query GetBidHistory($tokenId:String!,$seller:String!){
  getBids(tokenId:$tokenId,seller:$seller){
  tokenId
  seller
  bids {
    bidder
    bid
    claim
    txHash
    createdAt
  }
  }
}
`;
