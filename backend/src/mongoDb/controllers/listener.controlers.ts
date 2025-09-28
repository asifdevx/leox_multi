import {Fee } from "../schemas/marketplace.schema";
import {createEthContract } from "../../config/bsc.service";
import {io} from '../../index';

export async function feeListener () {
    const contract = await createEthContract();
    
   contract.on("UpdateFee",async(newFee , timestamp,event)=>{
    try {
        await Fee.create({
            fee: Number(newFee) / 10,
            updateAt: new Date(Number(timestamp) * 1000),
            txHash: event.transactionHash,
        })
    } catch (error) {
        console.warn("Failed to update fee in MongoDB:", error.message);
    }
    return io.emit("feeUpdate",Number(newFee));
   });
}