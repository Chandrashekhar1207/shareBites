import { DataTypes } from "sequelize";
import sequelize from "../db.js";
const Claim = sequelize.define("Claim", {
  claimantName: { type: DataTypes.STRING, allowNull: false },
  foodItem: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.STRING, allowNull: false }
});
export default Claim;