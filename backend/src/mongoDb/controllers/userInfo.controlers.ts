import * as s from "../schemas/marketplace.schema";
interface createUser {
  name?:string;
  gmail?:string;
  address: string;
  roles?: [string];
  isFirstTime?:boolean;

}
export const findUser = async (address: string) => {
  return await s.UsersInfo.findOne({ address });
};
export const createUser = async ({ name,gmail,address, roles ,isFirstTime}: createUser) => {
  return await s.UsersInfo.create({ name,gmail,address, roles,isFirstTime });
};

export const findByRole = async (role:string) =>{
  return await s.UsersInfo.find({roles : role},{name:1,address:1,_id:0});
}

export const findNFT = async ({tokenId,seller}:{tokenId:string,seller:string})=>await s.NFT.findOne({tokenId,seller:seller.toLowerCase()})