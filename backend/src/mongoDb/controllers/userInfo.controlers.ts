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

