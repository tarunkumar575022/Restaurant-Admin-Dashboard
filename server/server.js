import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ CORS (ONLY ONCE, BEFORE ROUTES)
const allowedOrigins = [
  "http://localhost:3000",
  "https://beamish-cuchufli-8902d7.netlify.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ Routes
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);

// ✅ Optional health check (helps verify Render)
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// ✅ Port (Render uses process.env.PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
