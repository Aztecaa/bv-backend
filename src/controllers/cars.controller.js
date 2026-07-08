// bv-backend/src/controllers/cars.controller.js

import {
    getAllCars,
    createCar,
    updateCar,
    deleteCar
} from '../services/cars.service.js'

/* --------------------------
   GET /autos
--------------------------- */
export async function getAutos(req, res) {
    try {
        const autos = await getAllCars()
        res.json(autos)
    } catch (error) {
        console.error('Error obteniendo autos:', error)
        res.status(500).json({
            message: 'Error obteniendo autos',
            error: error.message
        })
    }
}

/* --------------------------
   POST /autos
--------------------------- */
export async function createAuto(req, res) {
    try {
        const auto = req.body

        // Validación con los nombres reales del schema (inglés)
        if (!auto.brand || !auto.model) {
            return res.status(400).json({ message: 'Marca y modelo son requeridos' })
        }

        const createdCar = await createCar(auto)

        res.status(201).json({
            message: 'Auto agregado',
            auto: createdCar
        })
    } catch (error) {
        console.error('[cars] Error creando auto:', error)
        res.status(500).json({ message: 'Error creando auto', error: error.message })
    }
}

/* --------------------------
   PUT /autos/:id
--------------------------- */
export async function updateAuto(req, res) {
    try {
        const { id } = req.params
        const updatedCar = await updateCar(id, req.body)
        res.json({
            message: 'Auto actualizado',
            auto: updatedCar
        })
    } catch (error) {
        console.error('Error actualizando auto:', error)
        if (error.message === 'AUTO_NOT_FOUND') {
            return res.status(404).json({ message: 'Auto no encontrado' })
        }
        res.status(500).json({ message: 'Error actualizando auto' })
    }
}

/* --------------------------
   DELETE /autos/:id
--------------------------- */
export async function removeAuto(req, res) {
    try {
        const { id } = req.params
        const deletedCar = await deleteCar(id)
        res.json({
            message: 'Auto eliminado',
            auto: deletedCar
        })
    } catch (error) {
        console.error('Error eliminando auto:', error)
        if (error.message === 'AUTO_NOT_FOUND') {
            return res.status(404).json({ message: 'Auto no encontrado' })
        }
        res.status(500).json({ message: 'Error eliminando auto' })
    }
}