import express from "express";
import Claim from "../models/Claim.js";
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const claim = await Claim.create(req.body);
    res.json(claim);
  } catch (err) {
    res.status(500).json({ error: "Failed to claim food" });
  }
});
export default router;