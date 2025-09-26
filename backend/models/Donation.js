import { DataTypes } from "sequelize";
import sequelize from "../db.js";
const Donation = sequelize.define("Donation", {
  donorName: { type: DataTypes.STRING, allowNull: false },
  foodItem: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false }
});
export default Donation;