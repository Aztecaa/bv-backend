import { Router } from "express";
import {
  getAutos,
  createAuto,
  updateAuto,
  removeAuto
} from "../controllers/cars.controller.js";
const router = Router();
router.get("/", getAutos);
router.post("/", createAuto);
router.put("/:id", updateAuto);
router.delete("/:id", removeAuto);
export default router;