import { ethers } from "ethers";
import abi from "../ABI/abi.json";
import dotenv from "dotenv";

dotenv.config();

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const rpcUrl = process.env.NEXT_PUBLIC_BSC_RPC!;
const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY!;

console.log(contractAddress, rpcUrl,privateKey);

export const getAdminContract = () => {
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const signer = new ethers.Wallet(privateKey, provider);

  const contract = new ethers.Contract(contractAddress, abi, signer);

  return contract;
};
