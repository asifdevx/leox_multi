import * as s from "../schemas/marketplace.schema";
interface createUser {
  name?:string;
  gmail?:string;
  address: string;
  roles?: [string];
  isFirstTime?:boolean;
  follower?:number;
  following?:number;


}
export const findUser = async (address: string) => {
  return await s.UsersInfo.findOne({ address });
};
export const createUser = async ({ name,gmail,address, roles ,isFirstTime,follower,following}: createUser) => {
  return await s.UsersInfo.create({ name,gmail,address, roles,isFirstTime ,follower,following});
};

export const findByRole = async (role:string) =>{
  return await s.UsersInfo.find({roles : role},{name:1,address:1,_id:0});
}

export const findNFT = async ({tokenId,seller}:{tokenId:string,seller:string})=>await s.NFT.findOne({tokenId,seller:seller.toLowerCase()});


export const userProfileInfo = async (name:string)=>{
  const userDoc = await s.UsersInfo.findOne({ name });
  if (!userDoc) return false; // username not found
  const { address } = userDoc;

  const user = await findUser(address);
  if (!user) return false;

  const result = await Promise.allSettled([
    s.NFT.find({ seller: address }).lean(), //owned
    s.NFT.find({ seller: address, isListed: true }).lean(), //sale
    s.NFT.find({ owner: address }).lean(), //created
    s.NFT.find({ seller: address, isListed: true, claimed: true }).lean(), // sold
  ]);
  const [owned, sale, created, sold] = result.map((e) => e.status == 'fulfilled' ? e.value : [] )

  return {
    user: {
      name: user.name,
      address: user.address,
      roles: user.roles,
      follower: user.follower,
      following: user.following,
    },
    nfts: { owned, sale, created, sold },
  };
}


