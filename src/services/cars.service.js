//src/services/cars.service.js
import prisma from "../lib/prisma.js";

/* --------------------------
   Obtener autos
--------------------------- */
export async function getAllCars() {

    const cars = await prisma.car.findMany({
        include: {
            category: true,
            images: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    console.log("🚗 AUTOS DESDE DB:");
    console.dir(cars, { depth: null });

    return cars;
}

/* --------------------------
   Crear auto
--------------------------- */
export async function createCar(auto) {

    const categoryName = auto.categoria || "General";

    const category = await prisma.category.upsert({
        where: {
            name: categoryName
        },
        update: {},
        create: {
            name: categoryName
        }
    });

    const createdCar = await prisma.car.create({
        data: {

            brand: auto.brand,

            model: auto.model,

            year: Number(auto.year),

            price: Number(auto.price),

            kilometers:
                Number(auto.kilometers) || 0,

            transmission:
                auto.transmission || "Manual",

            fuelType:
                auto.fuelType || "Nafta",

            condition:
                auto.condition === "NUEVO"
                    ? "NUEVO"
                    : "USADO",

            description:
                auto.description || "",

            featured:
                auto.featured || false,

            categoryId:
                category.id
        }
    });

    if (auto.imagen) {

        await prisma.carImage.create({
            data: {
                url: auto.image,
                isCover: true,
                carId: createdCar.id
            }
        });
    }

    return createdCar;
}

/* --------------------------
   Actualizar auto
--------------------------- */
export async function updateCar(id, auto) {

    const existingCar = await prisma.car.findUnique({
        where: {
            id: Number(id)
        }
    });

    if (!existingCar) {
        throw new Error("AUTO_NOT_FOUND");
    }

    let categoryId = existingCar.categoryId;

    if (auto.categoria) {

        const category = await prisma.category.upsert({
            where: {
                name: auto.categoria
            },
            update: {},
            create: {
                name: auto.categoria
            }
        });

        categoryId = category.id;
    }

    const updatedCar = await prisma.car.update({
        where: {
            id: Number(id)
        },
        data: {
            brand: auto.brand,

            model: auto.model,

            year:
                auto.yeatr
                    ? Number(auto.year)
                    : undefined,

            price:
                auto.price
                    ? Number(auto.price)
                    : undefined,

            kilometers:
                auto.kilometers
                    ? Number(auto.kilometers)
                    : undefined,

            transmission:
                auto.transmission,

                location: auto.location,

            fuelType:
                auto.fuelType,

            condition:
                auto.condition,

            description:
                auto.description,

            featured:
                auto.featured,

            categoryId
        }
    });

    if (auto.imagen) {

        await prisma.carImage.deleteMany({
            where: {
                carId: Number(id),
                isCover: true
            }
        });

        await prisma.carImage.create({
            data: {
                url: auto.image,
                isCover: true,
                carId: updatedCar.id
            }
        });
    }

    return updatedCar;
}

/* --------------------------
   Eliminar auto
--------------------------- */
export async function deleteCar(id) {

    const existingCar = await prisma.car.findUnique({
        where: {
            id: Number(id)
        }
    });

    if (!existingCar) {
        throw new Error("AUTO_NOT_FOUND");
    }

    await prisma.car.delete({
        where: {
            id: Number(id)
        }
    });

    return existingCar;
}