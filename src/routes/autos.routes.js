//routes autos.routes.js
import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { isSupervisor } from "../middlewares/auth.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta ABSOLUTA correcta
const STOCK_PATH = path.join(__dirname, "../data/stock.json");

// Leer el stock
const readStock = () => {
  try {
    const data = fs.readFileSync(STOCK_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("❌ Error leyendo stock.json:", error);
    return [];
  }
};

// Guardar stock
const saveStock = (stock) => {
  try {
    fs.writeFileSync(STOCK_PATH, JSON.stringify(stock, null, 2));
    console.log("💾 Stock guardado correctamente");
  } catch (err) {
    console.error("❌ Error guardando stock:", err);
  }
};

/* --------------------------
    GET /autos
--------------------------- */
router.get("/", (req, res) => {
  console.log("📥 GET /autos solicitado");
  const autos = readStock();
  res.json(autos);
});

/* --------------------------
    POST /autos (solo supervisor)
--------------------------- */
router.post("/", isSupervisor, (req, res) => {
  console.log("📤 POST /autos → agregar auto");

  const nuevoAuto = req.body;

  if (!nuevoAuto || !nuevoAuto.marca || !nuevoAuto.modelo) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  const autos = readStock();

  nuevoAuto.id = autos.length ? autos[autos.length - 1].id + 1 : 1;

  autos.push(nuevoAuto);
  saveStock(autos);

  res.json({ message: "Auto agregado correctamente", nuevoAuto });
});



router.put("/:id", isSupervisor, (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body;

  const autos = readStock();
  const index = autos.findIndex(a => a.id == id);

  if (index === -1) {
    return res.status(404).json({ message: "Auto no encontrado" });
  }

  autos[index] = { ...autos[index], ...datosActualizados };
  saveStock(autos);

  res.json({ message: "Auto actualizado", auto: autos[index] });
});

router.delete("/:id", isSupervisor, (req, res) => {
  const { id } = req.params;
  const autos = readStock();

  const index = autos.findIndex(a => a.id == id);

  if (index === -1) {
    return res.status(404).json({ message: "Auto no encontrado" });
  }

  const autoEliminado = autos.splice(index, 1)[0];
  saveStock(autos);

  res.json({ message: "Auto eliminado", auto: autoEliminado });
});

export default router;
