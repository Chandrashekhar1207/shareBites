import express from "express";
import cors from "cors";
import sequelize from "./db.js";

import donationRoutes from "./routes/donationRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/donate", donationRoutes);
app.use("/api/claim", claimRoutes);
app.use("/api/auth", authRoutes);

// connect DB
sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((err) => console.log(err));

app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);
