import { ethers } from "ethers";
import abi from "../ABI/abi.json";
import dotenv from "dotenv";

dotenv.config();

declare global {
  interface Window {
    ethereum?: any;
  }
}

const contract_address = process.env.CONTRACT_ADDRESS!;
console.log("CONTRACT_ADDRESS", contract_address);

export const  createEthContract = async () => {
  const provider = new ethers.JsonRpcProvider(process.env.BSC_RPC!);
  const contract = new ethers.Contract(contract_address!, abi, provider);
  return contract;
};
