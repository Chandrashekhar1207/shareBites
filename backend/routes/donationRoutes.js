import express from "express";
import { upload } from "../middleware/upload.js";
import Donation from "../models/Donation.js";

import {
  createDonation,
  getNearbyDonations,
  claimDonation,
  removeDonation
} from "../controllers/donationController.js";

const router = express.Router();

// ⭐ GET ALL DONATIONS (FIX)
router.get("/", async (req, res) => {
  try {
    const donations = await Donation.findAll();
    res.json(donations);
  } catch (err) {
    console.error("GET ALL DONATIONS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});

// CREATE DONATION (MULTI IMAGES)
router.post("/", upload.array("images", 5), createDonation);

// GET ALL NEARBY DONATIONS
router.get("/nearby", getNearbyDonations);

// CLAIM DONATION
router.post("/claim", claimDonation);

// DELETE DONATION
router.delete("/:id", removeDonation);

export default router;
