import Donation from "../models/Donation.js";
import Claim from "../models/Claim.js";
import { Op } from "sequelize";

// --------------------------------------------------------
// 1) CREATE DONATION
// --------------------------------------------------------
export const createDonation = async (req, res) => {
  try {
    const {
      title,
      message,
      expiryTime,
      latitude,
      longitude,
      donorId,
      donorName,
      contactNo,
    } = req.body;

    if (
      !title ||
      !expiryTime ||
      !latitude ||
      !longitude ||
      !donorId ||
      !donorName ||
      !contactNo
    ) {
      return res.status(400).json({
        error: "All fields including donor contact are required",
      });
    }

    const images = req.files
      ? req.files.map((f) => `/uploads/${f.filename}`)
      : [];

    const donation = await Donation.create({
      title,
      message,
      expiryTime,
      latitude,
      longitude,
      donorId,
      donorName,
      contactNo,
      status: "available",
      images: JSON.stringify(images),
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
    const { latitude, longitude, radius = 3000, search = "" } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Location required" });
    }

    const radiusKm = radius / 1000;
    const R = 6371;

    const donations = await Donation.findAll({
      where: {
        status: "available",
        title: { [Op.like]: `%${search}%` },
        expiryTime: { [Op.gt]: new Date() },
      },
    });

    const filtered = donations
      .map((d) => {
        const dLat = (d.latitude - latitude) * (Math.PI / 180);
        const dLon = (d.longitude - longitude) * (Math.PI / 180);

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(latitude * Math.PI / 180) *
            Math.cos(d.latitude * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return { ...d.toJSON(), distance };
      })
      .filter((d) => d.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    res.json(filtered);
  } catch (err) {
    console.error("NEARBY DONATION ERROR:", err);
    res.status(500).json({ error: "Nearby search failed" });
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
      return res
        .status(400)
        .json({ error: "Donation already claimed or removed" });

    donation.status = "claimed";
    donation.claimedBy = claimantId;
    donation.claimedAt = new Date();
    await donation.save();

    await Claim.create({
      donationId,
      claimerId: claimantId,
      status: "accepted",
    });

    // 🔥 SOCKET EVENT → NOTIFY DONATOR ONLY
    req.io.emit("food_claimed", {
      donationId: donation.id,
      donorId: donation.donorId,
      claimerId: claimantId,
    });

    res.json({ message: "Donation claimed successfully!", donation });
  } catch (err) {
    console.error("CLAIM DONATION ERROR:", err);
    res.status(500).json({ error: "Claim failed" });
  }
};

// --------------------------------------------------------
// 4) GET DONATOR'S DONATIONS (NEW)
// --------------------------------------------------------
export const getMyDonations = async (req, res) => {
  try {
    const { donorId } = req.query;

    if (!donorId) {
      return res.status(400).json({ error: "donorId is required" });
    }

    const donations = await Donation.findAll({
      where: { donorId },
      order: [["createdAt", "DESC"]],
    });

    res.json(donations);
  } catch (err) {
    console.error("GET MY DONATIONS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};

// --------------------------------------------------------
// 5) REMOVE DONATION
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
