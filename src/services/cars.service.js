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

export async function createCar(data) {
    const { images = [], categoryId, ...carData } = data

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
    const { images = [], categoryId, ...carData } = data

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