import express from "express";
import cors from "cors";
import sequelize from "./db.js";
import donationRoutes from "./routes/donationRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // ✅ new

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/donate", donationRoutes);
app.use("/api/claim", claimRoutes);
app.use("/api/food", donationRoutes); // GET donations
app.use("/api/auth", authRoutes); // ✅ signup/login routes

// ✅ Auto-create tables (force: true recreates tables on every restart)
sequelize.sync({ force: true }).then(() => {
  console.log("MySQL tables recreated!");
});

// Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
