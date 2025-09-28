import { UserRole } from "../schemas/marketplace.schema";
interface createRole {
  address: string;
  roles: [string];
}
export const findRole = async (address: string) => {
  return await UserRole.findOne({ address });
};
export const createRole = async ({ address, roles }: createRole) => {
    console.log("create Role",address);
    
    return await UserRole.create({ address, roles });
};
