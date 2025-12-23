import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Donation = sequelize.define("Donation", {
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: true },

  // MULTIPLE IMAGES STORED AS JSON
  images: { type: DataTypes.TEXT, allowNull: true },

  expiryTime: { type: DataTypes.DATE, allowNull: false },

  latitude: { type: DataTypes.FLOAT, allowNull: false },
  longitude: { type: DataTypes.FLOAT, allowNull: false },

  donorId: { type: DataTypes.INTEGER, allowNull: false },

  // ✅ NEW CONTACT FIELDS
  donorName: { type: DataTypes.STRING, allowNull: false },
  contactNo: { type: DataTypes.STRING, allowNull: false },

  status: {
    type: DataTypes.ENUM("available", "claimed", "expired", "removed"),
    defaultValue: "available",
  },

  claimedBy: { type: DataTypes.INTEGER, allowNull: true },
  claimedAt: { type: DataTypes.DATE, allowNull: true },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default Donation;
