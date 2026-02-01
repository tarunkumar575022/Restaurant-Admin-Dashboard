import express from "express";
import {
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
  toggleAvailability,
  searchMenuItems,  
} from "../controllers/menuController.js";

const router = express.Router();



router.get("/", getMenu);
router.get("/search", searchMenuItems);
router.post("/", createMenu);
router.put("/:id", updateMenu);
router.delete("/:id", deleteMenu);
router.patch("/:id/availability", toggleAvailability);

export default router;
