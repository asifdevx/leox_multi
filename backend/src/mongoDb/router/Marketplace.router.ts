import { updateFee, findFee } from "../controllers/fee.controlers";
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

router.post("/updateFee", async (req: Request, res: Response) => {
  try {
    const { fee } = req.body;
    if (fee === undefined || fee === null)
      return res.status(400).json({ error: "Fee is required" });

    const txHash = await updateFee(fee); 

    res.json({ fee, txHash });
  } catch (error: any) {
    console.error("updateFee error:", error); 
    res.status(500).json({ error: error.message });
  }
});


export default router;
