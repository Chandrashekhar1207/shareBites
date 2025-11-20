import Donation from "../models/Donation.js";
import Claim from "../models/Claim.js";
import { Op } from "sequelize";

// --------------------------------------------------------
// 1) CREATE DONATION
// --------------------------------------------------------
export const createDonation = async (req, res) => {
  try {
    const { title, message, expiryTime, latitude, longitude, donorId } = req.body;

    if (!title || !expiryTime || !latitude || !longitude || !donorId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // MULTIPLE IMAGES
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const donation = await Donation.create({
      title,
      message,
      expiryTime,
      latitude,
      longitude,
      donorId,
      status: "available",
      images: JSON.stringify(images)
    });

    res.status(201).json(donation);
  } catch (err) {
    console.error("CREATE DONATION ERROR:", err);
    res.status(500).json({ error: "Backend error" });
  }
};

// --------------------------------------------------------
// 2) GET NEARBY DONATIONS
// --------------------------------------------------------
export const getNearbyDonations = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Location required" });
    }

    // convert radius meters → km
    const radiusKm = radius / 1000;

    const donations = await Donation.findAll({
      where: {
        status: "available",
        expiryTime: { [Op.gt]: new Date() }
      }
    });

    // Haversine formula
    const R = 6371; // km

    const filtered = donations.filter(d => {
      const dLat = (d.latitude - latitude) * (Math.PI / 180);
      const dLon = (d.longitude - longitude) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(latitude * (Math.PI / 180)) *
          Math.cos(d.latitude * (Math.PI / 180)) *
          Math.sin(dLon / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance <= radiusKm;
    });

    res.json(filtered);
  } catch (err) {
    console.error("NEARBY DONATION ERROR:", err);
    res.status(500).json({ error: "Error getting nearby donations" });
  }
};

// --------------------------------------------------------
// 3) CLAIM DONATION
// --------------------------------------------------------
export const claimDonation = async (req, res) => {
  try {
    const { donationId, claimantId } = req.body;

    if (!donationId || !claimantId) {
      return res.status(400).json({ error: "Missing claimant or donation ID" });
    }

    const donation = await Donation.findByPk(donationId);

    if (!donation)
      return res.status(404).json({ error: "Donation not found" });

    if (donation.status !== "available")
      return res.status(400).json({ error: "Donation already claimed or removed" });

    // update donation
    donation.status = "claimed";
    donation.claimedBy = claimantId;
    donation.claimedAt = new Date();
    await donation.save();

    // create claim record
    await Claim.create({
      donationId,
      claimerId: claimantId,  // backend column name
      status: "accepted"
    });

    res.json({ message: "Donation claimed successfully!", donation });

  } catch (err) {
    console.error("CLAIM DONATION ERROR:", err);
    res.status(500).json({ error: "Claim failed" });
  }
};

// --------------------------------------------------------
// 4) REMOVE DONATION
// --------------------------------------------------------
export const removeDonation = async (req, res) => {
  try {
    const { id } = req.params;

    const donation = await Donation.findByPk(id);
    
    if (!donation)
      return res.status(404).json({ error: "Donation not found" });

    donation.status = "removed";
    await donation.save();

    res.json({ message: "Donation removed successfully" });

  } catch (err) {
    console.error("REMOVE DONATION ERROR:", err);
    res.status(500).json({ error: "Could not remove donation" });
  }
};
