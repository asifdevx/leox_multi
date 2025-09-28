import { Fee } from "../schemas/marketplace.schema";
import { createEthContract } from "../../config/bsc.service";


// --------------------------------findfee -------------------------------------
export const findFee = async () => {

    const latestFee = await Fee.findOne().sort({ updateAt: -1 }).lean();  

    if (!latestFee) {
      console.log("no latest fee");
      
      const contract = await createEthContract();
      const feeBigNumber = await contract.marketplaceFee();
      const fee= Number(feeBigNumber) / 10;
     
      const newFee = await Fee.create({
        fee: Number(fee),
        updateAt: new Date(),
        txHash: null, 
      });
  
      return newFee.toObject();
    }
  
   
    return latestFee;
  };
  