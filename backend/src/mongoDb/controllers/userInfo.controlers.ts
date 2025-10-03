import { UsersInfo } from "../schemas/marketplace.schema";
interface createUser {
  name?:string;
  gmail?:string;
  address: string;
  roles: [string];

}
export const findUser = async (address: string) => {
  return await UsersInfo.findOne({ address });
};
export const createUser = async ({ name,gmail,address, roles }: createUser) => {
  return await UsersInfo.create({ name,gmail,address, roles });
};

