export const GET_NFT = `
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

export const GET_USER_ROLE = `
query UserRole($address:String!){
  getUserRole(address:$address){
    address
    roles
  }
}
`;

export const ADD_USER_ROLE = `
mutation addRole($address:String!,$role:String!){
  getUserRole(address:$address,role:$role){
    address
    roles
  }
}
`;
export const REMOVE_USER_ROLE = `
mutation removeRole($address:String!,$role:String!){
  getUserRole(address:$address,role:$role){
    address
    roles
  }
}
`;