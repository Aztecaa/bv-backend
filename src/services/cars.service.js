// bv-backend/src/services/cars.service.js

import prisma from '../lib/prisma.js'

/* --------------------------
   Obtener todos los autos
--------------------------- */
export async function getAllCars() {
    const cars = await prisma.car.findMany({
        include: {
            category: true,
            images: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return cars
}

/* --------------------------
   Crear auto
--------------------------- */
export async function createCar(auto) {
    const categoryName = auto.categoria || 'General'

    const category = await prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: { name: categoryName }
    })

    const createdCar = await prisma.car.create({
        data: {
            brand:        auto.brand,
            model:        auto.model,
            version:      auto.version       || null,
            year:         Number(auto.year),
            price:        Number(auto.price),
            offerPrice:   auto.offerPrice    ? Number(auto.offerPrice) : null,
            kilometers:   Number(auto.kilometers) || 0,
            transmission: auto.transmission  || 'Manual',
            fuelType:     auto.fuelType      || 'Nafta',
            condition:    auto.condition === 'NUEVO' ? 'NUEVO' : 'USADO',
            description:  auto.description   || '',
            shortDesc:    auto.shortDesc      || null,
            location:     auto.location       || null,
            uniqueOwner:  auto.uniqueOwner    || false,
            transferable: auto.transferable   ?? true,
            acceptsTrade: auto.acceptsTrade   || false,
            saleType:     auto.saleType       || null,
            featured:     auto.featured       || false,
            visible:      auto.visible        ?? true,
            categoryId:   category.id
        }
    })

    // Guardar imágenes — recibe un array de URLs desde el frontend
    // El frontend primero sube a /upload y obtiene las URLs, luego las manda acá
    if (auto.images && Array.isArray(auto.images) && auto.images.length > 0) {
        for (let i = 0; i < auto.images.length; i++) {
            await prisma.carImage.create({
                data: {
                    url:     auto.images[i],
                    isCover: i === 0,  // La primera imagen es la portada
                    carId:   createdCar.id
                }
            })
        }
    }

    return createdCar
}

/* --------------------------
   Actualizar auto
--------------------------- */
export async function updateCar(id, auto) {
    const existingCar = await prisma.car.findUnique({
        where: { id: Number(id) }
    })

    if (!existingCar) throw new Error('AUTO_NOT_FOUND')

    let categoryId = existingCar.categoryId

    if (auto.categoria) {
        const category = await prisma.category.upsert({
            where: { name: auto.categoria },
            update: {},
            create: { name: auto.categoria }
        })
        categoryId = category.id
    }

    const updatedCar = await prisma.car.update({
        where: { id: Number(id) },
        data: {
            brand:        auto.brand,
            model:        auto.model,
            version:      auto.version       !== undefined ? auto.version       : undefined,
            year:         auto.year          ? Number(auto.year)          : undefined,  // corregido de auto.yeatr
            price:        auto.price         ? Number(auto.price)         : undefined,
            offerPrice:   auto.offerPrice    !== undefined ? Number(auto.offerPrice) : undefined,
            kilometers:   auto.kilometers    ? Number(auto.kilometers)    : undefined,
            transmission: auto.transmission  !== undefined ? auto.transmission  : undefined,
            fuelType:     auto.fuelType      !== undefined ? auto.fuelType      : undefined,
            condition:    auto.condition     !== undefined ? auto.condition     : undefined,
            description:  auto.description   !== undefined ? auto.description   : undefined,
            shortDesc:    auto.shortDesc     !== undefined ? auto.shortDesc     : undefined,
            location:     auto.location      !== undefined ? auto.location      : undefined,
            uniqueOwner:  auto.uniqueOwner   !== undefined ? auto.uniqueOwner   : undefined,
            transferable: auto.transferable  !== undefined ? auto.transferable  : undefined,
            acceptsTrade: auto.acceptsTrade  !== undefined ? auto.acceptsTrade  : undefined,
            saleType:     auto.saleType      !== undefined ? auto.saleType      : undefined,
            featured:     auto.featured      !== undefined ? auto.featured      : undefined,
            visible:      auto.visible       !== undefined ? auto.visible       : undefined,
            sold:         auto.sold          !== undefined ? auto.sold          : undefined,
            reserved:     auto.reserved      !== undefined ? auto.reserved      : undefined,
            categoryId
        }
    })

    // Actualizar imágenes si se mandaron nuevas URLs
    if (auto.images && Array.isArray(auto.images) && auto.images.length > 0) {
        // Borramos las imágenes anteriores de portada y reemplazamos
        await prisma.carImage.deleteMany({
            where: { carId: Number(id), isCover: true }
        })

        for (let i = 0; i < auto.images.length; i++) {
            await prisma.carImage.create({
                data: {
                    url:     auto.images[i],
                    isCover: i === 0,
                    carId:   updatedCar.id
                }
            })
        }
    }

    return updatedCar
}

/* --------------------------
   Eliminar auto
--------------------------- */
export async function deleteCar(id) {
    const existingCar = await prisma.car.findUnique({
        where: { id: Number(id) }
    })

    if (!existingCar) throw new Error('AUTO_NOT_FOUND')

    await prisma.car.delete({
        where: { id: Number(id) }
    })

    return existingCar
}