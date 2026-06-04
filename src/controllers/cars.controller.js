import {
    getAllCars,
    createCar,
    updateCar,
    deleteCar
} from "../services/cars.service.js";

/* -------------------------
GET--------------------------- */
export async function getAutos(req, res) {
    try {
        const autos = await getAllCars();
        res.json(autos);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error obteniendo autos"
        });
    }
}

/* -------------------------
   POST--------------------------- */
export async function createAuto(req, res) {
    try {
        const auto = req.body;
        if (!auto.marca || !auto.modelo) {
            return res.status(400).json({
                message: "Datos incompletos"
            });
        }
        const createdCar = await createCar(auto);
        res.json({
            message: "Auto agregado",
            auto: createdCar
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error creando auto"
        });
    }
}
/* -------------------------
   PUT--------------------------- */
export async function updateAuto(req, res) {
    try {
        const { id } = req.params;
        const updatedCar = await updateCar(id, req.body);
        res.json({
            message: "Auto actualizado",
            auto: updatedCar
        });
    } catch (error) {
        console.error(error);
        if (error.message === "AUTO_NOT_FOUND") {
            return res.status(404).json({
                message: "Auto no encontrado"
            });
        }
        res.status(500).json({
            message: "Error actualizando auto"
        });
    }
}
/* -------------------------
   DELETE--------------------------- */
export async function removeAuto(req, res) {
    try {
        const { id } = req.params;
        const deletedCar = await deleteCar(id);
        res.json({
            message: "Auto eliminado",
            auto: deletedCar
        });
    } catch (error) {
        console.error(error);
        if (error.message === "AUTO_NOT_FOUND") {
            return res.status(404).json({
                message: "Auto no encontrado"

});
        }
        res.status(500).json({
            message: "Error eliminando auto"
        });
    }
}