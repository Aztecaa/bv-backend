// src/services/cars.service.js

import prisma from '../lib/prisma.js'

export async function getAllCars() {
    return prisma.car.findMany({
        include: {
            category: true,
            images: true
        },
        orderBy: { createdAt: 'desc' }
    })
}

const CAR_EDITABLE_FIELDS = [
    'brand', 'model', 'version', 'year', 'price', 'offerPrice', 'kilometers',
    'transmission', 'fuelType', 'condition', 'description', 'shortDesc',
    'location', 'uniqueOwner', 'transferable', 'acceptsTrade', 'saleType',
    'featured', 'visible', 'sold', 'reserved', 'slug'
]

// Campos numéricos: los inputs del form los mandan como String
// (v-model sin el modificador .number), así que hay que convertirlos
// antes de pasárselos a Prisma o revienta con "Invalid ... provided String".
const CAR_INT_FIELDS = ['year', 'kilometers']
const CAR_FLOAT_FIELDS = ['price', 'offerPrice']

function coerceCarValue(field, value) {
    if (value === '' || value === null || value === undefined) {
        // offerPrice es opcional: string vacío -> null. year/kilometers/price
        // son obligatorios en el schema, así que si llegan vacíos los dejamos
        // pasar como null y que Prisma avise si de verdad no puede ser null.
        return null
    }
    if (CAR_INT_FIELDS.includes(field)) {
        const n = parseInt(value, 10)
        return Number.isNaN(n) ? null : n
    }
    if (CAR_FLOAT_FIELDS.includes(field)) {
        const n = parseFloat(value)
        return Number.isNaN(n) ? null : n
    }
    return value
}

function pickCarFields(data) {
    const result = {}
    for (const field of CAR_EDITABLE_FIELDS) {
        if (data[field] !== undefined) {
            result[field] = coerceCarValue(field, data[field])
        }
    }
    return result
}

export async function createCar(data) {
    const { images = [], categoryId } = data
    const carData = pickCarFields(data)

    return prisma.car.create({
        data: {
            ...carData,
            categoryId: categoryId ? Number(categoryId) : null,
            images: {
                create: images.map(img => ({
                    url: img.url,
                    isCover: img.isCover || false
                }))
            }
        },
        include: {
            category: true,
            images: true
        }
    })
}

export async function updateCar(id, data) {
    const { images = [], categoryId } = data
    const carData = pickCarFields(data)

    // Primero borramos imágenes anteriores si se envían nuevas
    if (images.length > 0) {
        await prisma.carImage.deleteMany({ where: { carId: Number(id) } })
    }

    return prisma.car.update({
        where: { id: Number(id) },
        data: {
            ...carData,
            categoryId: categoryId ? Number(categoryId) : undefined,
            images: images.length > 0 ? {
                create: images.map(img => ({
                    url: img.url,
                    isCover: img.isCover || false
                }))
            } : undefined
        },
        include: {
            category: true,
            images: true
        }
    })
}

export async function deleteCar(id) {
    return prisma.car.delete({
        where: { id: Number(id) }
    })
}