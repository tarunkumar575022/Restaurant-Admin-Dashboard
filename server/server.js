import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

/* -------------------- ROUTES -------------------- */
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);

/* -------------------- START SERVER -------------------- */
const PORT = process.env.PORT || 5000;

// 🔴 Connect DB ONLY after env is loaded
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
