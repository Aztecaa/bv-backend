import { Router } from "express";
import { isSupervisor } from "../middlewares/auth.js";
import {
  getAutos,
  createAuto,
  updateAuto,
  removeAuto
} from "../controllers/cars.controller.js";
const router = Router();
router.get("/", getAutos);
router.post("/", isSupervisor, createAuto);
router.put("/:id", isSupervisor, updateAuto);
router.delete("/:id", isSupervisor, removeAuto);
export default router;