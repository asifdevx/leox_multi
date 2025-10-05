import { Fee } from "../schemas/marketplace.schema";
import { createEthContract } from "../../config/bsc.service";

export const feeHistory = async () => {
  let history=await Fee.find().sort({ updateAt: -1 }).limit(6).lean();

  if(!history.length) { 
    console.log("there is no fee");
    const contract = await createEthContract();
    const feeBigNumber = await contract.marketplaceFee();
    const fee = Number(feeBigNumber) / 10;
    const newFee = await Fee.create({
      fee,
      updateAt:new Date(),
      txHash: null,
    });
     history= [newFee.toObject()];
  }
  return history;
};  
