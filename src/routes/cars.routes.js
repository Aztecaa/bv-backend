import { Router } from "express";
import {
  getAutos,
  createAuto,
  updateAuto,
  removeAuto
} from "../controllers/cars.controller.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";

const router = Router();
router.get("/", getAutos); // pública, cualquiera puede ver los autos
router.post("/", isAuthenticated, isAdmin, createAuto);
router.put("/:id", isAuthenticated, isAdmin, updateAuto);
router.delete("/:id", isAuthenticated, isAdmin, removeAuto);
export default router;