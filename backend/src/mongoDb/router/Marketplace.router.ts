import {  findFee } from "../controllers/fee.controlers";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/fee", async (_, res: Response) => {
  try {
    const fee = await findFee();
    res.status(200).json(fee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



export default router;
