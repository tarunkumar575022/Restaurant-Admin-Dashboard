import express from "express"
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);


app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://beamish-cuchufli-8902d7.netlify.app"
  ],
  credentials: true
}));