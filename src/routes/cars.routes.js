import { Router } from "express";
import { isAdmin } from "../middlewares/auth.js";
import {
  getAutos,
  createAuto,
  updateAuto,
  removeAuto
} from "../controllers/cars.controller.js";
const router = Router();
router.get("/", getAutos);
router.post("/", isAdmin, createAuto);
router.put("/:id", isAdmin, updateAuto);
router.delete("/:id", isAdmin, removeAuto);
export default router;