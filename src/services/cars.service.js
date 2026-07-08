// bv-backend/src/services/cars.service.js

import {
    getCarsData,
    createCarData,
    updateCarData,
    deleteCarData
} from '../lib/simpleStore.js'

/* --------------------------
   Obtener todos los autos
--------------------------- */
export async function getAllCars() {
    return getCarsData()
}

/* --------------------------
   Crear auto
--------------------------- */
export async function createCar(auto) {
    return createCarData(auto)
}

/* --------------------------
   Actualizar auto
--------------------------- */
export async function updateCar(id, auto) {
    return updateCarData(id, auto)
}

/* --------------------------
   Eliminar auto
--------------------------- */
export async function deleteCar(id) {
    return deleteCarData(id)
}