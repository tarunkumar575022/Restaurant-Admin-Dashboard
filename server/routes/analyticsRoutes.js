import express from "express";
import { topSellers, generateAIInsights } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/top-sellers", topSellers);
router.get("/ai-insights", generateAIInsights);

export default router;
