import sequelize from "../db.js";
import Donation from "../models/Donation.js";

export const getNearbyFoods = async (req, res) => {
  try {
    const { lat, lon, radius } = req.query;
    const R = radius || 5;

    const query = `
      SELECT *, (
        6371 * acos(
          cos(radians(:lat)) *
          cos(radians(latitude)) *
          cos(radians(longitude) - radians(:lon)) +
          sin(radians(:lat)) *
          sin(radians(latitude))
        )
      ) AS distance
      FROM Donations
      WHERE expiryTime > NOW()
      HAVING distance <= :radius
      ORDER BY distance ASC;
    `;

    const foods = await sequelize.query(query, {
      replacements: { lat, lon, radius: R },
      type: sequelize.QueryTypes.SELECT,
    });

    res.json(foods);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};
