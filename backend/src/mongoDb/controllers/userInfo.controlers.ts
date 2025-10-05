import { UsersInfo } from "../schemas/marketplace.schema";
interface createUser {
  name?:string;
  gmail?:string;
  address: string;
  roles?: [string];
  isFirstTime?:boolean;

}
export const findUser = async (address: string) => {
  return await UsersInfo.findOne({ address });
};
export const createUser = async ({ name,gmail,address, roles ,isFirstTime}: createUser) => {
  return await UsersInfo.create({ name,gmail,address, roles,isFirstTime });
};

export const findByRole = async (role:string) =>{
  return await UsersInfo.find({roles : role},{name:1,address:1,_id:0});
}