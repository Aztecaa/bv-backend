import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

/* --------------------------
   GET categories
--------------------------- */
router.get("/", async (req, res) => {
    const categories = await prisma.category.findMany()
    res.json(categories)
})


export default router;