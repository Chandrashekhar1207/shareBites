import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

try {
  await sequelize.authenticate();
  console.log("✅ Database connected!");

  // 🔥 Add this to sync all models (including new role column)
  await sequelize.sync({ alter: true });
  console.log("🛠️ Models synchronized!");

} catch (error) {
  console.error("❌ Unable to connect:", error);
}

export default sequelize;
