import {findUser} from "../mongoDb/controllers/userInfo.controlers";

export const findNameByNftAddress =async (address:string)=>{
    const sellerAddress = address.toLowerCase();
    const user = await findUser(sellerAddress);
    return user?.name;
}