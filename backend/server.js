import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import sequelize from "./db.js";

import donationRoutes from "./routes/donationRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import ChatMessage from "./models/chatMessage.js";
import Donation from "./models/Donation.js";

import path from "path";
import { fileURLToPath } from "url";

const app = express();

// -------------------- FIX __dirname (ES MODULES) --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- MIDDLEWARE (ORDER MATTERS) --------------------
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------- HTTP SERVER (CRITICAL) --------------------
const server = http.createServer(app);

// -------------------- SOCKET.IO (CORRECT ATTACHMENT) --------------------
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// 🔑 MAKE IO AVAILABLE IN CONTROLLERS
app.use((req, res, next) => {
  req.io = io;
  next();
});

// -------------------- ROUTES --------------------
app.use("/api/donate", donationRoutes);
app.use("/api/claim", claimRoutes);
app.use("/api/auth", authRoutes);

// -------------------- DATABASE --------------------
sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ Database synced"))
  .catch((err) => console.error("❌ DB Sync Error:", err));

// -------------------- SOCKET EVENTS --------------------
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // 👤 USER PERSONAL ROOM
  socket.on("join_user", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`👤 Joined user_${userId}`);
  });

  // 💬 JOIN CHAT ROOM
  socket.on("join_room", async ({ room, donationId, userId }) => {
    try {
      const donation = await Donation.findByPk(donationId);

      if (
        !donation ||
        (donation.donorId !== Number(userId) &&
          donation.claimedBy !== Number(userId))
      ) {
        console.log("⛔ Unauthorized chat access");
        return;
      }

      socket.join(room);
      console.log(`📦 Joined room ${room}`);

      const history = await ChatMessage.findAll({
        where: { donationId },
        order: [["createdAt", "ASC"]],
      });

      socket.emit("chat_history", history);
    } catch (err) {
      console.error("❌ Join room error:", err);
    }
  });

  // ✉️ SEND MESSAGE
  socket.on("send_message", async ({ room, donationId, text, sender }) => {
    try {
      const saved = await ChatMessage.create({
        donationId,
        senderId: sender,
        text,
      });

      io.to(room).emit("receive_message", {
        text: saved.text,
        sender: saved.senderId,
        time: saved.createdAt,
      });
    } catch (err) {
      console.error("❌ Send message error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔌 Socket disconnected:", socket.id);
  });
});

// -------------------- START SERVER --------------------
server.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
