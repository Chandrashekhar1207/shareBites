import express from "express";
import Donation from "../models/Donation.js";
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const donation = await Donation.create(req.body);
    res.json(donation);
  } catch (err) {
    res.status(500).json({ error: "Failed to add donation" });
  }
});
router.get("/", async (req, res) => {
  try {
    const donations = await Donation.findAll();
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});
export default router;