import { ethers } from "ethers";
import abi from "@/components/ABI/abi.json";
import dotenv from "dotenv";

dotenv.config();


const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;


export const createEthContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask not found");
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []); 
    const signer = await provider.getSigner();
   return new ethers.Contract(CONTRACT_ADDRESS!, abi, signer);
    
  };