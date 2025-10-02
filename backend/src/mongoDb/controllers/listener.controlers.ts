import { Fee } from "../schemas/marketplace.schema";
import { createEthContract } from "../../config/bsc.service";
import { io } from "../../index";

export async function feeListener() {
  const contract = await createEthContract();

  contract.on("UpdateFee", async (newFee, timestamp, event) => {
    try {
      const savedFee = await Fee.create({
        fee:Number(newFee) / 10,
        updateAt:new Date(Number(timestamp) * 1000),
        txHash: event.transactionHash,
      });
      io.emit ("updateFee",savedFee.toObject());
      console.log("✅ Fee updated:", savedFee);
    } catch (error) {
      console.warn("Failed to update fee in MongoDB:", error.message);
    }
  });
}
