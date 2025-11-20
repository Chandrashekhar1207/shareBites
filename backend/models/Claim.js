import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Claim = sequelize.define("Claim", {
  donationId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },

  claimerId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },

  status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected", "collected"),
    defaultValue: "accepted"
  },

  claimedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

export default Claim;
