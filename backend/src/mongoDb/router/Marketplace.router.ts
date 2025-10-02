import {  feeHistory } from "../controllers/fee.controlers";
import express, { Response } from "express";

const router = express.Router();



router.get("/latestFees" ,async(_,res:Response)=>{
  try {
    const feehistory = await feeHistory();
    console.log("feehistory",feehistory);
    
    res.status(200).json(feehistory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})



export default router;
