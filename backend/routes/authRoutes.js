import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// ---------------------------
// SIGNUP
// ---------------------------
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Ensure role is one of allowed values
    const validRoles = ["admin", "volunteer", "donator", "ngo", "individual_claimer"];
    const finalRole = role && validRoles.includes(role.toLowerCase())
      ? role.toLowerCase()
      : "donator"; // default

    // Check existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: finalRole
    });

    return res.json({
      message: "User created!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    return res.status(500).json({ error: "Signup failed" });
  }
});

// ---------------------------
// LOGIN
// ---------------------------
// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // 🔥 This was missing
      },
    });

  } catch (err) {
    return res.status(500).json({ error: "Login failed" });
  }
});


export default router;
