import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const ChatMessage = sequelize.define("ChatMessage", {
  donationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default ChatMessage;
