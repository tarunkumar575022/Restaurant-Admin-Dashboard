import express from "express";
import { topSellers } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/top-sellers", topSellers);

export default router;
