import { Fee } from "../schemas/nft.schema";
import { createEthContract } from "../../config/bsc.service";
import { getAdminContract } from "../../config/adminContract";

// --------------------------------findfee -------------------------------------
export const findFee = async () => {

    const latestFee = await Fee.findOne().sort({ updateAt: -1 }).lean();
    console.log(latestFee,"latestFee");
    
    if (!latestFee) {
      
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
  
  // --------------------------------UPDatefee -------------------------------------
  export const updateFee = async (fee: number) => {
    const contract =  getAdminContract();
    const tx = await contract.updateMarketplaceFee(fee);
    const receipt = await tx.wait();
  
    try {
      await Fee.create({
        fee : fee / 10 ,
        updateAt: new Date(),
        txhase: receipt.transactionHash,
      });
    } catch (error) {
      console.warn("failed to fatch fee", error.message);
    }
    return receipt.transactionHash;
  };
  