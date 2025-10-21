import {  feeHistory } from "../controllers/fee.controlers";
import express, { Request,Response } from "express";
import { findByRole,findNFT,findUser } from "../controllers/userInfo.controlers";

const router = express.Router();

router.post("/findByAddress",
async(req:Request,res:Response)=>{
  try {
    const {address} = req.body;
    console.log("role",address);
    
    if (!address) res.status(400).json({ message: "address is required" });
    
      
    const data = await findUser(address);
    return res.status(200).json(data);
       } catch (error) {
    console.error("Error in /findByAddress:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
})

router.post("/findByRole",
async(req:Request,res:Response)=>{
  try {
    const {role} = req.body;
    console.log("role",role);
    
    if (!role) res.status(400).json({ message: "Role is required" });
    
      
    const data = await findByRole(role);
    return res.status(200).json(data);
       } catch (error) {
    console.error("Error in /findByRole:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
})

router.get("/latestFees",
async(_,res:Response)=>{
  try {
    const feehistory = await feeHistory();
    console.log("feehistory",feehistory);
    
    res.status(200).json(feehistory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

router.post("/findNFT",
async(req:Request,res:Response)=>{
  try {
    const {tokenId,seller} = req.body;

    
    if (!tokenId && !seller) res.status(400).json({ message: "Role is required" });
    
      
    const data = await findNFT({tokenId,seller});
    return res.status(200).json(data);
       } catch (error) {
    console.error("Error in /findNft:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
})
export default router;
