import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Claim = sequelize.define(
  "Claim",
  {
    donationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Donations",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    claimerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "accepted",
        "rejected",
        "collected"
      ),
      defaultValue: "pending", // 🔥 FIX
    },

    claimedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["donationId"], // 🔒 one claim per donation
      },
    ],
  }
);

export default Claim;
