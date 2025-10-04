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
mutation addRole($name:String,$gmail:String,$address:String!,$role:String,$action:String){
  updateInfo(name:$name,gmail:$gmail,address:$address,role:$role,action:$action){
    name
    gmail
    address
    roles
    isFirstTime
  }
}
`;
